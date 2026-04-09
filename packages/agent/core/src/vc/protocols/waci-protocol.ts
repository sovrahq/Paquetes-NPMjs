import { Issuer, UnsignedCredential, VerifiableCredential } from "@sovrahq/vc-core";
import {
    Actor, ClaimFormat, CredentialFulfillment, CredentialManifest, CredentialManifestStyles,
    DIDCommVersion, DisplayMappingObject, GoalCode, InputDescriptor, OutputDescriptor, PresentationDefinition,
    PresentationDefinitionFrame, WACIInterpreter, WACIMessage, WACIMessageType, validateVcByInputDescriptor,
    OfferCredentialMessageParams
} from "@sovrahq/waci";
import { decode } from "base-64";
import * as jsonpath from 'jsonpath';
import * as jsonschema from 'jsonschema';
import { Agent } from "../../agent";
import { IStorage } from "../../models/agent-storage";
import { DID } from "../../models/did";
import { getSearchParam } from "../../utils";
import { CredentialFlow } from "../models/credentia-flow";
import { ActorRole, VCProtocol, VCProtocolResponse } from "./vc-protocol";

export class WACIProtocol extends VCProtocol<WACIMessage> {
    private waciInterpreter: WACIInterpreter;
    private storage: IStorage;
    private _processedMessageIds: Set<string> = new Set();

    issueCredentials: (waciInvitationId: string, holderDID: string) => Promise<WACICredentialOfferResponse>;
    issuerVerificationRules?: (waciInvitationId: string, holdedDID: string) => Promise<IssuerVerificationRuleResult>;
    selectVcToPresent?: (vcs: VerifiableCredential[]) => Promise<VerifiableCredential[]>;
    presentationDefinition?: (invitationId: string) => Promise<{ inputDescriptors: InputDescriptor[], frame?: PresentationDefinitionFrame }>;
    credentialApplication?: (inputs: { descriptor: InputDescriptor, credentials: VerifiableCredentialWithInfo[] }[], selectiveDisclosure?: SelectiveDisclosure, message?: WACIMessage, issuer?: (Issuer | CredentialManifestStyles), credentialsToReceive?: VerifiableCredentialWithInfo[]) => Promise<VerifiableCredential[]>;
    businessVerificationRules?: (invitationId: string, holderDID: DID, vcs: VerifiableCredential[]) => Promise<BusinessRulesVerificationResult>;

    // Custom sign/verify hooks for Ed25519 + SD-JWT
    customSignCredential?: (vc: any, did: string) => Promise<any>;
    customVerifyCredential?: (vc: any) => Promise<any>;

    constructor(params?: {
        issuer?: {
            issueCredentials?: (waciInvitationId: string, holderDID: string) => Promise<WACICredentialOfferResponse>,
            issuerVerificationRules?: (waciInvitationId: string, holdedDID: string) => Promise<IssuerVerificationRuleResult>,
        },
        holder?: {
            selectVcToPresent?: (vcs: VerifiableCredential[],) => Promise<VerifiableCredential[]>,
            credentialApplication?: (inputs:
                {
                    descriptor: InputDescriptor,
                    credentials: VerifiableCredentialWithInfo[]
                }[],
                selectiveDisclosure: SelectiveDisclosure,
                message?: WACIMessage,
                issuer?: (Issuer | CredentialManifestStyles),
                credentialsToReceive?: {
                    data: VerifiableCredential,
                    styles: CredentialManifestStyles, display: CredentialDisplay
                }[]) => Promise<VerifiableCredential[]>,
        },
        verifier?: {
            presentationDefinition?: (invitationId: string) => Promise<{ inputDescriptors: InputDescriptor[], frame?: PresentationDefinitionFrame }>,
            businessVerificationRules?: (invitationId: string, holderDID: DID, vcs: VerifiableCredential[]) => Promise<BusinessRulesVerificationResult>,
        }
        customSignCredential?: (vc: any, did: string) => Promise<any>,
        customVerifyCredential?: (vc: any) => Promise<any>,
        storage: IStorage,
    }) {
        super();
        this.issueCredentials = params?.issuer?.issueCredentials;
        this.issuerVerificationRules = params?.issuer?.issuerVerificationRules;
        this.selectVcToPresent = params?.holder?.selectVcToPresent;
        this.presentationDefinition = params?.verifier?.presentationDefinition;
        this.credentialApplication = params?.holder?.credentialApplication;
        this.businessVerificationRules = params.verifier?.businessVerificationRules;
        this.storage = params?.storage;
        this.customSignCredential = params?.customSignCredential;
        this.customVerifyCredential = params?.customVerifyCredential;
    }

    initialize(params: {
        agent: Agent
    }) {
        this.agent = params.agent;

        this.waciInterpreter = new WACIInterpreter();
        if (this.issueCredentials) {
            this.waciInterpreter.setUpFor<Actor.Issuer>({
                getCredentialManifest: async (p: { invitationId: string, holderDid: string, message: WACIMessage }): Promise<OfferCredentialMessageParams> => {
                    const result = await this.issueCredentials(p.invitationId, p.holderDid);
                    if (result.result == WACICredentialOfferResult.Succeded) {

                        const currentDID = !p.message ? null : this.agent.identity.getDIDs().find(x => x == p.message.to as any ||
                            (Array.isArray(p.message.to) && p.message.to.some(y => y == x)));

                        return {
                            issuerDid: currentDID,
                            issuerName: result.credentialManifest.issuer.name,
                            output: result.credentialManifest.credentials.map(x => ({
                                outputDescriptor: x.outputDescriptor,
                                verifiableCredential: x.credential,
                                format: (x as any).format || "ldp_vc"
                            })),
                            issuerStyles: result.credentialManifest.issuer.styles,
                            input: result.credentialManifest.inputDescriptors,
                            frame: result.credentialManifest.frame,
                        }
                    } else if (result.result == WACICredentialOfferResult.Failed) {
                        throw new Error(result.rejectMsg);
                    }
                },
                signCredential: async (args: { vc: any, message: WACIMessage }) => {
                    const data = await this.storage.get(args.message.thid);

                    let invitationId: string = data && data.length > 0 && data[0].pthid ? data[0].pthid : null;

                    const currentDID = !args?.message ? null : this.agent.identity.getDIDs().find(x => x == args.message.to as any ||
                        (Array.isArray(args.message.to) && args.message.to.some(y => y == x)));

                    let vc;
                    if (this.customSignCredential) {
                        vc = await this.customSignCredential(args.vc, currentDID || this.agent.identity.getOperationalDID().value);
                    }
                    // If customSignCredential returned null or was not set, fall back to standard JSON-LD signing
                    if (!vc) {
                        vc = await this.agent.vc.signVC({
                            credential: args.vc,
                            did: currentDID ? DID.from(currentDID) : null
                        });
                        this.onCredentialIssued.trigger({ vc: vc, toDID: DID.from(vc.credentialSubject.id), invitationId });
                    } else {
                        // For SD-JWT (string), extract holderDID from the original credential or fallback to message.from
                        const holderDID = typeof vc === 'string'
                            ? (args.vc.credentialSubject?.id
                                ? DID.from(args.vc.credentialSubject.id)
                                : (args.message?.from ? DID.from(args.message.from) : null))
                            : DID.from(vc.credentialSubject.id);
                        this.onCredentialIssued.trigger({ vc: vc, toDID: holderDID, invitationId });
                    }

                    return vc;
                },
                credentialVerificationResult: async (p: { result: boolean, error?: any, thid: string, vcs: any[], message: WACIMessage }) => {
                    const data = await this.storage.get(p.thid);
                    const m = data[0];
                    const invitationId = data[0].pthid;

                    let issuerVerification: IssuerVerificationRuleResult = null;

                    if (this.issuerVerificationRules) {
                        issuerVerification = await this.issuerVerificationRules(invitationId, m.from);
                    }

                    const verified = (!issuerVerification && p.result) || (issuerVerification.verified && p.result);

                    if (p.vcs && p.vcs.length > 0) {
                        this.onPresentationVerified.trigger({
                            invitationId: invitationId,
                            rejectMsg: verified ? null : (p.error || issuerVerification.rejectMsg),
                            verified: verified,
                            thid: p.thid,
                            vcs: p.vcs,
                            messageId: p.message.id,
                        });
                    }
                },
                verifyCredential: async (vc) => {
                    if (this.customVerifyCredential) {
                        return await this.customVerifyCredential(vc);
                    }
                    return await this.agent.vc.verifyVC({ vc: vc });
                },
                handleIssuanceAck: async (p: { status: any, from: string, pthid: string, thid: string, message: WACIMessage }) => {
                    const data = await this.storage.get(p.thid);
                    const invitationId = data[0].pthid;

                    this.onAckCompleted.trigger({
                        invitationId,
                        status: p.status,
                        messageId: p.message.id,
                        role: ActorRole.Issuer,
                        thid: p.thid,
                    });
                },
                verifyPresentation: async (vc) => await this.agent.vc.verifyPresentation({
                    challenge: vc.challenge,
                    presentation: vc.presentation
                }),
            }, Actor.Issuer);
        }

        if (this.credentialApplication || this.selectVcToPresent) {
            this.waciInterpreter.setUpFor<Actor.Holder>({
                getHolderDID: async (p: { message: WACIMessage }) => {
                    const currentDID = !p.message ? null : this.agent.identity.getDIDs().find(x => x == p.message.to as any ||
                        (Array.isArray(p.message.to) && p.message.to.some(y => y == x)));

                    return currentDID || this.agent.identity.getOperationalDID().value;
                },
                getCredentialApplication: async (p: {
                    manifest: CredentialManifest,
                    fulfillment: CredentialFulfillment
                    message?: WACIMessage;
                }) => {

                    if (this.credentialApplication) {
                        // Map the credential descriptors to the actual credentials
                        const credential_manifests = await this.storage.get<CredentialManifestData[]>(InternalStorageEnum.CredentialManifests);
                        const manifestId = p.manifest.data.json.credential_manifest.id;
                        console.log('[WACI-OFFER] Storing manifest with id:', manifestId);
                        console.log('[WACI-OFFER] Existing manifests:', credential_manifests?.map(x => x.id) || 'none');
                        if (!credential_manifests?.find(x => x.id == manifestId)) {
                            await this.storage.add(InternalStorageEnum.CredentialManifests, credential_manifests ? [...credential_manifests, p.manifest.data.json.credential_manifest] : [p.manifest.data.json.credential_manifest]);
                            console.log('[WACI-OFFER] ✅ Manifest stored successfully');
                        } else {
                            console.log('[WACI-OFFER] ⏭️ Manifest already exists, skipping');
                        }

                        // Map the credential descriptors to the actual credentials
                        const credentialsToReceive = p.manifest.data.json.credential_manifest.output_descriptors.map((descriptor) => {
                            const credentialDescriptor = p.fulfillment.data.json.credential_fulfillment.descriptor_map.find(
                                (map) => map.id === descriptor.id
                            );
                            return {
                                data: jsonpath.value(p.fulfillment.data.json, credentialDescriptor.path) as VerifiableCredential,
                                styles: descriptor.styles,
                                display: descriptor.display
                            };
                        })

                        // Get the credentials from the agent
                        const credentials = await this.agent.vc.getVerifiableCredentialsWithInfo();

                        // Filter the credentials based on the input descriptors
                        const inputs = (p.manifest.data.json.credential_manifest.presentation_definition?.input_descriptors || []).map((descriptor) => {
                            return {
                                descriptor,
                                credentials: (credentials || []).reduce((acc: {
                                    data: VerifiableCredential<any>;
                                    styles: CredentialManifestStyles;
                                    display: CredentialDisplay;
                                }[], credential) => {
                                    if (this.validateSchema(credential.data, descriptor)) {
                                        acc.push(credential);
                                    }
                                    return acc;
                                }, [])
                            };
                        });

                        const cs = inputs.flat();
                        const output_descriptors = cs.map(x => x.credentials).flat()

                        const selectiveDisclosure =
                            !p.manifest.data.json.credential_manifest.presentation_definition?.frame
                                && p.manifest.data.json.credential_manifest.output_descriptors ? null :
                                SelectiveDisclosure.from(p.manifest.data.json.credential_manifest.presentation_definition.frame,
                                    output_descriptors.map(x => x));

                        // Apply the credential application
                        let credentialsToPresent = await this.credentialApplication(inputs,
                            selectiveDisclosure,
                            p.message,
                            p.manifest.data.json.credential_manifest.issuer,
                            credentialsToReceive,
                        );

                        if (p.manifest.data.json.credential_manifest.presentation_definition?.frame) {
                            const derivedVc = new Array<VerifiableCredential>();

                            //Recorro todas las credenciales a presentar y las derivo (Se aplica selective disclosure)
                            for (let vc of credentialsToPresent) {
                                derivedVc.push(await this.agent.vc.deriveVC({
                                    vc: vc,
                                    deriveProofFrame: p.manifest.data.json.credential_manifest.presentation_definition?.frame
                                }))
                            }

                            credentialsToPresent = derivedVc;
                        }

                        return {
                            credentialsToPresent: credentialsToPresent,
                            presentationProofTypes: ["JsonWebSignature2020", "EcdsaSecp256k1Signature2019"],
                        }
                    } else {

                        if (!(p.manifest.data.json.credential_manifest?.presentation_definition?.input_descriptors)) {
                            return {
                                credentialsToPresent: [],
                                presentationProofTypes: ["JsonWebSignature2020", "EcdsaSecp256k1Signature2019"]
                            };
                        }

                        let credentials = await this.agent.vc.getVerifiableCredentials();


                        credentials = credentials.filter(vc => validateVcByInputDescriptor(vc,
                            p.manifest.data.json.credential_manifest?.presentation_definition?.input_descriptors[0]))

                        const credentialsToPresent = await this.selectVcToPresent(credentials);

                        return {
                            credentialsToPresent: credentialsToPresent,
                            presentationProofTypes: ["JsonWebSignature2020", "EcdsaSecp256k1Signature2019"],
                        }

                    }
                },
                getCredentialPresentation: async (p: { inputDescriptors: InputDescriptor[], frame: PresentationDefinitionFrame, message?: WACIMessage }) => {

                    if (this.credentialApplication) {

                        // Get the credentials from the agent
                        const credentials = await this.agent.vc.getVerifiableCredentialsWithInfo();
                        console.log(`[WACI-PRESENT] Total stored credentials: ${credentials?.length || 0}`);
                        credentials?.forEach((c, i) => {
                            const dataType = typeof c?.data;
                            const isString = dataType === 'string';
                            console.log(`[WACI-PRESENT] Credential[${i}]: type=${dataType}, isSDJWT=${isString}, hasStyles=${!!c?.styles}, hasDisplay=${!!c?.display}`);
                            if (isString) {
                                console.log(`[WACI-PRESENT] Credential[${i}] SD-JWT preview: ${(c.data as any).substring(0, 80)}...`);
                            } else if (c?.data && typeof c.data === 'object') {
                                console.log(`[WACI-PRESENT] Credential[${i}] type: ${JSON.stringify((c.data as any)?.type)}`);
                            }
                        });

                        // Filter the credentials based on the input descriptors
                        const inputs = (p.inputDescriptors || []).map((descriptor) => {
                            console.log(`[WACI-PRESENT] Checking descriptor: ${descriptor.id}, fields: ${descriptor.constraints?.fields?.map(f => f.path[0]).join(', ')}`);
                            return {
                                descriptor,
                                credentials: (credentials || []).reduce((acc, credential) => {
                                    const matches = this.validateSchema(credential.data, descriptor);
                                    console.log(`[WACI-PRESENT] validateSchema result: ${matches} for credential type=${typeof credential.data}`);
                                    if (matches) {
                                        acc.push(credential);
                                    }
                                    return acc;
                                }, [])
                            };
                        });

                        const cs = inputs.flat();
                        const output_descriptors = cs.map(x => x.credentials).flat()

                        const selectiveDisclosure =
                            !p?.frame ? null :
                                SelectiveDisclosure.from(p.frame,
                                    output_descriptors.map(x => x));

                        let credentialsToPresent = await this.credentialApplication(inputs, selectiveDisclosure, p.message);

                        if (p.frame) {
                            const derivedVc = new Array<VerifiableCredential>();

                            //Recorro todas las credenciales a presentar y las derivo (Se aplica selective disclosure)
                            for (let vc of credentialsToPresent) {
                                derivedVc.push(await this.agent.vc.deriveVC({
                                    vc: vc,
                                    deriveProofFrame: p?.frame
                                }))
                            }

                            credentialsToPresent = derivedVc;
                        }

                        return {
                            credentialsToPresent: credentialsToPresent,
                        }
                    } else {
                        let credentials = await this.agent.vc.getVerifiableCredentials();
                        credentials = credentials.filter(vc => validateVcByInputDescriptor(vc, p.inputDescriptors[0]))
                        const credentialsToPresent = await this.selectVcToPresent(credentials);

                        return {
                            credentialsToPresent: credentialsToPresent,
                        }
                    }
                },
                handleCredentialFulfillment: async (p: { credentialFulfillment: CredentialFulfillment[], message: WACIMessage, threadManifests?: any[] }) => {

                    const credentialManifests = await this.storage.get<CredentialManifestData[]>(InternalStorageEnum.CredentialManifests);
                    const fulfillmentManifestId = p.credentialFulfillment[0]?.data?.json?.credential_fulfillment?.manifest_id;

                    let credentialManifest = credentialManifests?.find(x => x.id === fulfillmentManifestId);

                    // Fallback: if not in storage, try to get from the WACI message thread
                    if (!credentialManifest && p.threadManifests?.length) {
                        const threadManifest = p.threadManifests.find(
                            (m: any) => m?.data?.json?.credential_manifest?.id === fulfillmentManifestId
                        );
                        if (threadManifest) {
                            console.log('[WACI-FULFILL] Using manifest from message thread (not found in storage)');
                            credentialManifest = threadManifest.data.json.credential_manifest;
                        }
                    }

                    // Last resort fallback: extract credentials directly from fulfillment
                    if (!credentialManifest) {
                        console.warn('[WACI-FULFILL] No manifest found in storage or thread, extracting from fulfillment directly');
                        const fulfillment = p.credentialFulfillment[0]?.data?.json;
                        if (fulfillment?.credential_fulfillment?.descriptor_map && fulfillment?.verifiableCredential) {
                            const credentials = fulfillment.credential_fulfillment.descriptor_map.map(
                                (desc: any) => ({
                                    data: jsonpath.value(fulfillment, desc.path) as VerifiableCredential,
                                    styles: undefined,
                                    display: undefined,
                                })
                            );
                            this.onVcArrived.trigger({ credentials, issuer: undefined, messageId: p.message?.id });
                            return true;
                        }
                        console.warn(`[WACI-FULFILL] No credential manifest found for manifest_id: ${fulfillmentManifestId}, skipping (likely DWN replay)`);
                        return false;
                    }

                    // Clean up stored manifests
                    if (credentialManifests?.length) {
                        await this.storage.add(InternalStorageEnum.CredentialManifests, credentialManifests.filter(x => x.id !== fulfillmentManifestId));
                    }

                    const credentials = credentialManifest.output_descriptors.map(
                        (descriptor) => {
                            const credentialDescriptor =
                                p.credentialFulfillment[0].data.json.credential_fulfillment.descriptor_map.find(
                                    (map) => map.id === descriptor.id
                                );
                            return {
                                data: jsonpath.value(p.credentialFulfillment[0].data.json, credentialDescriptor.path) as VerifiableCredential,
                                styles: descriptor.styles,
                                display: descriptor.display,
                            };
                        }
                    )

                    this.onVcArrived.trigger({ credentials, issuer: credentialManifest.issuer, messageId: p.message?.id })

                    return true;
                },
                handlePresentationAck: async (p: { status: any, message: WACIMessage }) => {
                    if (p.message.type !== "https://didcomm.org/report-problem/2.0/problem-report" && (p.message.type as string) !== "https://didcomm.org/report-problem/1.0/problem-report") {
                        const data = await this.storage.get(p.message.thid);
                        // const ot = await this.storage.get(data[0].thid);
                        // const ot2 = await this.storage.get(data[0].id);
                        const invitationId = data[0].pthid;

                        this.onAckCompleted.trigger({
                            status: p.status,
                            role: ActorRole.Holder,
                            messageId: p.message.id,
                            thid: p.message.thid,
                            invitationId,
                        });
                    }
                },
                signPresentation: async (p: { contentToSign: any, challenge: string, domain: string, message: WACIMessage }) => {
                    // SD-JWT: unwrap VC objects with format/raw and skip JSON-LD signing
                    if (p.contentToSign && typeof p.contentToSign === 'object') {
                        const vcs = p.contentToSign.verifiableCredential || [];
                        p.contentToSign.verifiableCredential = vcs.map((vc: any) => {
                            if (typeof vc === 'object' && vc !== null && vc.format === 'sd-jwt' && vc.raw) {
                                return vc.raw;
                            }
                            return vc;
                        });
                        const hasSDJWT = p.contentToSign.verifiableCredential.some((vc: any) => typeof vc === 'string' && vc.includes('~'));
                        if (hasSDJWT) {
                            return p.contentToSign;
                        }
                    }

                    const signature = await this.agent.vc.signPresentation({
                        contentToSign: p.contentToSign,
                        challenge: p.challenge,
                        domain: p.domain,
                    });

                    return signature;
                },
            }, Actor.Holder);
        }

        if (this.presentationDefinition) {
            this.waciInterpreter.setUpFor<Actor.Verifier>({
                getPresentationDefinition: async (p: { invitationId: string }) => {
                    const pDef = await this.presentationDefinition(p.invitationId);
                    return {
                        inputDescriptors: pDef.inputDescriptors,
                        frame: pDef.frame
                    };
                    // return this.presentationDefinition(p.invitationId);
                },
                credentialVerificationResult: async (p: { result: boolean, error?: any, thid: string, vcs: any[], message: WACIMessage }) => {
                    const data = await this.storage.get(p.thid);

                    const invitationId = data[0].pthid;

                    this.onPresentationVerified.trigger({
                        invitationId: invitationId,
                        verified: p.result,
                        thid: p.thid,
                        vcs: p.vcs,
                        messageId: p.message?.id
                    });
                },
                verifyCredential: async (vc: VerifiableCredential) => {
                    console.log('[WACI-VERIFY] 🔵 verifyCredential called, vc type:', typeof vc, 'hasCustomVerify:', !!this.customVerifyCredential);
                    if (typeof vc === 'string') {
                        console.log('[WACI-VERIFY] SD-JWT vc preview:', (vc as string).substring(0, 80) + '...');
                    }
                    let result;
                    if (this.customVerifyCredential) {
                        console.log('[WACI-VERIFY] 🔵 Calling customVerifyCredential...');
                        result = await this.customVerifyCredential(vc);
                        console.log('[WACI-VERIFY] ✅ customVerifyCredential result:', result);
                    } else {
                        console.log('[WACI-VERIFY] 🔵 Calling agent.vc.verifyVC...');
                        result = await this.agent.vc.verifyVC({ vc: vc });
                        console.log('[WACI-VERIFY] ✅ verifyVC result:', result);
                    }

                    this.onVcVerified.trigger({
                        verified: result.result,
                        presentationVerified: true,
                        vc: vc,
                    });

                    return result;
                },
                verifyPresentation: async (p) => {
                    // Check if VP contains SD-JWT credentials (string with ~ separator)
                    const vcs = p.presentation && p.presentation.verifiableCredential ? p.presentation.verifiableCredential : [];
                    const hasSDJWT = vcs.some((vc: any) => typeof vc === 'string' && vc.includes('~'));
                    if (hasSDJWT) {
                        // SD-JWT VPs don't have a proof field — skip VP-level verification
                        return { result: true };
                    }

                    return {
                        result: true
                    }

                    // const data = await this.storage.get(p.message.thid);

                    // const invitationId = data[0].pthid;

                    // let result = await this.agent.vc.verifyPresentation({
                    //     presentation: p.presentation,
                    //     challenge: p.challenge,
                    // });

                    // if (result.result && this.businessVerificationRules) {
                    //     let bvrResult = await this.businessVerificationRules(invitationId, DID.from(p.holderDid), p.presentation);

                    //     if (bvrResult.result == false) {
                    //         result = { result: false, error: { name: "businessVerificationRules", description: bvrResult.rejectMessage, code: null } }
                    //     }
                    // }

                    // if (!result.result) {
                    //     this.onVcVerified.trigger({
                    //         verified: false,
                    //         presentationVerified: false,
                    //         vc: p.presentation,
                    //     });
                    // }

                    // return result;
                },
            }, Actor.Verifier);
        }
    }

    async processMessage(message: WACIMessage | string, context?: any, did?: DID): Promise<VCProtocolResponse | void> {

        if (typeof message == "string" && getSearchParam('_oob', message)) {
            const oob = this.decodeMessage(getSearchParam('_oob', message));

            if (typeof oob === "string") {
                message = JSON.parse(oob);
            }
        }

        const waciMessage = message as WACIMessage;

        // Dedup: skip messages already processed (prevents duplicate signing/webhooks)
        if (waciMessage.id && this._processedMessageIds.has(waciMessage.id)) {
            console.log('[WACI-DEDUP] Skipping already processed message:', waciMessage.id, 'type:', waciMessage.type);
            return;
        }
        if (waciMessage.id) {
            this._processedMessageIds.add(waciMessage.id);
            setTimeout(() => { this._processedMessageIds.delete(waciMessage.id); }, 120000);
        }

        let messages = waciMessage.thid ? await this.storage.get<WACIMessage[]>(waciMessage.thid) || new Array<WACIMessage>() : new Array<WACIMessage>();
        messages.push(waciMessage);

        const response = await this.waciInterpreter.processMessage(messages);

        if (response) {
            this.storage.add(response.message.id, [response.message])
        }

        if (response) {
            response.message.from = (did?.value) || response.message.from;

            if (response?.message.thid) {
                messages.push(response.message);
                this.storage.update(response.message.thid, messages);
            }

            // DIDComm v1 messages should be sent as plaintext JSON
            if (response.message.type && /\/1\.0\//.test(response.message.type)) {
                return {
                    to: DID.from(response.target),
                    message: JSON.stringify(response.message)
                };
            }

            try {
                return {
                    to: DID.from(response.target),
                    message: (await this.agent.messaging.packMessage({
                        message: response.message as any,
                        to: DID.from(response.target),
                        messageManagerCompatible: context?.messageManagerCompatible,
                    })).packedMessage
                };
            } catch (packErr) {
                console.warn('[WACI] Failed to pack DIDCommV2 response, sending as plaintext:', packErr?.message);
                return {
                    to: DID.from(response.target),
                    message: JSON.stringify(response.message)
                };
            }
        }

        if (messages[messages.length - 1].type == WACIMessageType.ProblemReport || (messages[messages.length - 1].type as string) == 'https://didcomm.org/report-problem/1.0/problem-report') {
            const problemReportMessage = messages[messages.length - 1];

            const data = await this.storage.get(problemReportMessage.thid);
            const ot = await this.storage.get(data[0].thid);
            const invitationId = ot ? ot[0].pthid : data.pthid;


            this.onProblemReport.trigger({
                did: DID.from(problemReportMessage.from),
                code: problemReportMessage.body?.code,
                codeMessage: problemReportMessage.body?.comment,
                messageId: waciMessage.id,
                invitationId: invitationId,
            });
        }

    }


    async createOBBInvitation(goalCode: GoalCode, did: DID, didcommVersion?: string) {
        if (!did) throw new Error("You need set a did to createOOBInvitation")
        const version = didcommVersion === 'v1' ? DIDCommVersion.V1 : undefined;
        return await this.waciInterpreter.createOOBInvitation(did.value, goalCode, {}, version);
    }

    async createInvitationMessage(flow: CredentialFlow, did: DID, didcommVersion?: string): Promise<WACIMessage> {
        return await this.createOBBInvitation(flow == CredentialFlow.Issuance ? GoalCode.Issuance : GoalCode.Presentation, did, didcommVersion);
    }

    async isProtocolMessage(message: any): Promise<boolean> {
        if (typeof message == "string" && getSearchParam('_oob', message)) {
            const oob = this.decodeMessage(getSearchParam('_oob', message));
            if (typeof oob === "string") {
                message = JSON.parse(oob);
            }
        }
        return this.waciInterpreter.isWACIMessage(message);
    }

    private decodeMessage(message: string) {
        try {

            return decode(message);
        } catch (error) {
            return null;
        }
    }


    private validateSchema = (vc: VerifiableCredential, inputDescriptor: InputDescriptor) => {
        if (!vc) return false;
        // SD-JWT credentials are strings — delegate to validateVcByInputDescriptor which handles them
        if (typeof vc === 'string') {
            return validateVcByInputDescriptor(vc, inputDescriptor);
        }
        if (typeof vc !== 'object') return false;
        if (!inputDescriptor?.constraints?.fields) return true;
        for (const field of inputDescriptor.constraints.fields) {
            const fieldValues = field.path?.map((path) => {
                try {
                    return jsonpath.value(vc, path);
                } catch {
                    return undefined;
                }
            });

            for (const value of fieldValues) {
                if (!value) return false;
                if (field.filter) {
                    const { errors } = jsonschema.validate(value, field.filter);
                    if (errors.length) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
}

export enum WACIRequest {
    CredentialManifestRequested,
}

export enum InternalStorageEnum {
    CredentialManifests = 'CredentialManifests',
}

export type VerifiableCredentialWithInfo = {
    data: VerifiableCredential;
    styles?: CredentialManifestStyles;
    display?: CredentialDisplay;
}

export class SelectiveDisclosure {
    allFieldsToReveal: string[];
    credentialSubjectFieldsToReveal: string[];

    constructor() {

    }

    static from(frame: any, outputDescriptors: any[]): SelectiveDisclosure {
        const allFieldsToReveal: string[] = [];
        const credentialSubjectFieldsToReveal: string[] = [];

        // Para allFieldsToReveal
        for (const key in frame) {
            if (key !== '@context' && key !== 'credentialSubject') {
                allFieldsToReveal.push(key);
            }
        }

        // Para credentialSubjectFieldsToReveal
        for (const key in frame.credentialSubject) {
            if (key !== '@explicit' && key !== 'type') {
                const descriptor = outputDescriptors.find(descriptor =>
                    descriptor.display?.properties?.some(prop => prop.path.includes(`$.credentialSubject.${key}`))
                );

                if (descriptor) {
                    const property = descriptor.display.properties.find(prop => prop.path.includes(`$.credentialSubject.${key}`));
                    credentialSubjectFieldsToReveal.push(property.label);
                } else {
                    credentialSubjectFieldsToReveal.push(key);  // usar la key directamente si no encontramos la descripción
                }
            }
        }

        const sd = new SelectiveDisclosure();

        sd.allFieldsToReveal = allFieldsToReveal;
        sd.credentialSubjectFieldsToReveal = credentialSubjectFieldsToReveal;

        return sd;
    }
}

export type SelectiveDisclosureField = {
    id: string;
}

export type CredentialManifestData = {
    id: string;
    version: string;
    issuer: IssuerData;
    format?: ClaimFormat;
    output_descriptors: OutputDescriptor[];
    presentation_definition?: PresentationDefinition;
}

export type IssuerData = {
    id: string;
    name: string;
    styles?: CredentialManifestStyles;
}

export type CredentialDisplay = {
    title?: DisplayMappingObject;
    subtitle?: DisplayMappingObject;
    description?: DisplayMappingObject;
    properties?: (DisplayMappingObject & {
        label?: string;
    })[];
}

export class WACIEventArg {
    request: WACIRequest
}

export class CredentialRequestedEventArg extends WACIEventArg {
    waciInvitationId: string;
    fromDid: string;
}

export type IssuerVerificationRuleResult = {
    verified: boolean;
    rejectMsg: string;
}

export type BusinessRulesVerificationResult = { result: true } | { result: false, rejectMessage: string };

export type WACICredentialOfferResponse = WACICredentialOfferWaitForResponse | WACICredentialOfferRejected | WACICredentialOfferSucceded;

export enum WACICredentialOfferResult {
    Succeded,
    Failed,
    AsyncProcess,
}

export interface WACICredentialOfferWaitForResponse {
    result: WACICredentialOfferResult.AsyncProcess;
}

export class WACICredentialOfferRejected {
    result: WACICredentialOfferResult.Failed = WACICredentialOfferResult.Failed;
    rejectMsg: string;
}

export class WACICredentialOfferSucceded {
    result: WACICredentialOfferResult.Succeded = WACICredentialOfferResult.Succeded;

    credentialManifest: {
        options?: {
            challenge: string,
            domain: string,
        };
        issuer: {
            name: string,
            styles: CredentialManifestStyles;
        };
        credentials: {
            credential: UnsignedCredential;
            outputDescriptor: OutputDescriptor;
        }[];
        inputDescriptors?: InputDescriptor[];
        frame?: PresentationDefinitionFrame
    }

    constructor(credentialManifest: {
        options?: {
            challenge: string,
            domain: string,
        };
        issuer: {
            name: string,
            styles: CredentialManifestStyles;
        };
        credentials: {
            credential: UnsignedCredential;
            outputDescriptor: OutputDescriptor;
        }[];
        inputDescriptors?: InputDescriptor[];
        frame?: PresentationDefinitionFrame,
    }) {
        this.credentialManifest = credentialManifest;
    }
}