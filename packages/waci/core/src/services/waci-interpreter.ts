import { handlers } from '../handlers';
import { InputCallbacks } from '../callbacks';
import {
  WACIMessageType,
  WACIMessageTypeV1,
  WACIMessage,
  GoalCode,
  Actor,
  CredentialManifest,
  CredentialFulfillment,
  WACIResponse,
  WACIMessageHandlerResponse,
  DIDCommVersion,
  detectDIDCommVersion,
  normalizeToV2,
  convertToVersion,
} from '../types';
import { createUUID, getObjectValues } from '../utils';
import { SUPPORTED_ALGORITHMS } from '../constants';
import { PresentationProceed } from '../handlers/presentation/step-4-1-presentation-proceed.handler';
import { OfferCredentialProceed } from '../handlers/issuance/step-4-1-offer-credential-proceed.handler';

export class WACIInterpreter {
  private readonly enabledActors: Actor[];
  private callbacks: InputCallbacks;

  constructor() {
    this.enabledActors = [];
    this.callbacks = {};
  }

  setUpFor<T extends Actor>(
    params: InputCallbacks[T],
    actor: T,
  ): WACIInterpreter {
    this.enabledActors.push(actor);
    this.callbacks[actor] = params;
    return this;
  }

  isWACIMessage(messageToCheck: any): messageToCheck is WACIMessage {
    try {
      const allTypes = [
        ...getObjectValues(WACIMessageType),
        ...getObjectValues(WACIMessageTypeV1),
      ];
      return allTypes.includes(messageToCheck.type);
    } catch (error) {
      return false;
    }
  }

  async createOOBInvitation(
    senderDID: string,
    goalCode: GoalCode,
    body = {},
    version?: DIDCommVersion,
  ): Promise<WACIMessage> {
    const type = version === DIDCommVersion.V1
      ? convertToVersion(WACIMessageType.OutOfBandInvitation, DIDCommVersion.V1) as any
      : WACIMessageType.OutOfBandInvitation;

    return {
      type,
      id: createUUID(),
      from: senderDID,
      body: {
        ...body,
        goal_code: goalCode,
        accept: SUPPORTED_ALGORITHMS,
      },
    };
  }

  async createOfferCredentialMessage(
    issuerDID: string,
    holderDID: string,
    manifest: CredentialManifest,
    fulfillment: CredentialFulfillment,
  ): Promise<WACIMessage> {
    return {
      type: WACIMessageType.OfferCredential,
      id: createUUID(),
      from: issuerDID,
      to: [issuerDID],
      body: {},
      attachments: [manifest, fulfillment],
    };
  }

  async processMessage(
    messageThread: WACIMessage[],
  ): Promise<WACIResponse | void> {
    const message = messageThread[messageThread.length - 1];

    // Detect incoming version and normalize v1 → v2 for handler lookup
    const incomingVersion = detectDIDCommVersion(message.type as string);
    const normalizedType = normalizeToV2(message.type as string) as any;

    for await (const enabledActor of this.enabledActors) {
      const messageHandler = handlers[enabledActor].get(normalizedType);
      if (messageHandler) {
        // Temporarily set normalized type for the handler
        const originalType = message.type;
        message.type = normalizedType;

        const response = await messageHandler.handle(messageThread, this.callbacks);

        // Restore original type
        message.type = originalType;

        if (response) {
          // Convert response type back to v1 if the interlocutor speaks v1
          if (incomingVersion === DIDCommVersion.V1) {
            response.message.type = convertToVersion(
              response.message.type as string,
              DIDCommVersion.V1,
            ) as any;
          }
          return {
            ...response,
            target: response.message.to[0],
            message: response.message,
          };
        }
        return;
      }
    }

    throw Error(`No handler found for message of type '${message.type}'`);
  }

  async presentationProceed(
    messageThread: WACIMessage[],
    credentialsToPresent: any[],
    presentationProofTypes?: string[]) {

    let response: WACIMessageHandlerResponse = null;

    // Normalize last message type for comparison
    const lastType = normalizeToV2(
      messageThread[messageThread.length - 1].type as string,
    );

    if (lastType == WACIMessageType.OfferCredential) {
      response = await OfferCredentialProceed.handle(messageThread, credentialsToPresent, presentationProofTypes, this.callbacks)
    } else if (lastType == WACIMessageType.RequestPresentation) {
      response = await PresentationProceed.presentCredentials(messageThread, credentialsToPresent, this.callbacks);
    }

    if (!response) {
      throw new Error("To call this process, the message thread must end with a message of type OfferCredential or RequestPresentation.");
    }

    return {
      ...response,
      target: response.message.to[0],
      message: response.message,
    };
  }
}
