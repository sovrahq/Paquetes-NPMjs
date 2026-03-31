import { isNil } from 'lodash';
import { RegisterHandler } from '../decorators/register-handler.decorator';
import {
  AckStatus,
  Actor,
  WACIMessage,
  WACIMessageHandler,
  WACIMessageHandlerResponse,
  WACIMessageResponseType,
  WACIMessageType,
} from '../../types';
import {
  extractExpectedChallenge,
  createUUID,
  verifyPresentation,
} from '../../utils';
import { ProblemReportMessage } from '../../types/problem-report';

@RegisterHandler(Actor.Verifier, WACIMessageType.PresentProof)
export class PresentProofHandler implements WACIMessageHandler {
  async handle(
    messageThread: WACIMessage[],
    callbacks: any,
  ): Promise<WACIMessageHandlerResponse> {
    console.log('[STEP-5] 🔵 PresentProof handler started');
    const messageToProcess = messageThread[messageThread.length - 1];

    const holderDID = messageToProcess.from;
    const verifierDID = messageToProcess.to[0];
    console.log('[STEP-5] holder:', holderDID, 'verifier:', verifierDID);

    const problemReport = new ProblemReportMessage();
    const requestPresentationMessage = messageThread.find(
      (message) => message.type === WACIMessageType.RequestPresentation,
    );
    console.log('[STEP-5] requestPresentationMessage found:', !!requestPresentationMessage);

    const response = {
      responseType: WACIMessageResponseType.ReplyThread,
      message: {
        type: WACIMessageType.PresentationAck,
        id: createUUID(),
        thid: messageToProcess.thid,
        from: verifierDID,
        to: [holderDID],
        body: { status: undefined },
      },
    };

    const challengeToCheck = extractExpectedChallenge(
      requestPresentationMessage,
    );
    console.log('[STEP-5] challenge:', challengeToCheck);

    const presentation = messageToProcess?.attachments?.[0]?.data?.json;
    console.log('[STEP-5] presentation type:', typeof presentation, 'hasVCs:', !!presentation?.verifiableCredential);
    if (presentation?.verifiableCredential) {
      console.log('[STEP-5] VCs count:', presentation.verifiableCredential.length, 'types:', presentation.verifiableCredential.map((v: any) => typeof v));
    }

    console.log('[STEP-5] 🔵 Calling verifyPresentation callback...');
    const verifyPresentationResult = await callbacks[
      Actor.Verifier
    ].verifyPresentation({ presentation, challenge: challengeToCheck, message: messageToProcess, holderDid: holderDID });
    console.log('[STEP-5] ✅ verifyPresentation result:', verifyPresentationResult);

    if (!verifyPresentationResult.result) {
      //TO DO error codes from vc suite
      return {
        responseType: WACIMessageResponseType.ReplyThread,
        message: {
          type: WACIMessageType.ProblemReport,
          id: createUUID(),
          thid: messageToProcess.id,
          from: verifierDID,
          to: [holderDID],
          body: problemReport.presentProofMessage(
            verifyPresentationResult.error.name,
            verifyPresentationResult.error.description,
          ),
        },
      };
    }

    console.log('[STEP-5] requestPresentation attachments count:', requestPresentationMessage?.attachments?.length);
    const requests = requestPresentationMessage.attachments.filter(
      (attachment) => !isNil(attachment.data.json.presentation_definition),
    );
    console.log('[STEP-5] requests with presentation_definition:', requests.length);

    console.log('[STEP-5] messageToProcess attachments count:', messageToProcess?.attachments?.length);
    if (messageToProcess?.attachments) {
      messageToProcess.attachments.forEach((att: any, i: number) => {
        console.log(`[STEP-5] attachment[${i}] has presentation_submission:`, !!att?.data?.json?.presentation_submission, 'definition_id:', att?.data?.json?.presentation_submission?.definition_id);
      });
    }
    if (requests.length > 0) {
      requests.forEach((req: any, i: number) => {
        console.log(`[STEP-5] request[${i}] presentation_definition.id:`, req?.data?.json?.presentation_definition?.id);
      });
    }

    const submissionsToCheck = requests
      .filter((request) => !isNil(request?.data?.json?.presentation_definition))
      .map((request) => ({
        presentationDefinition: request.data.json.presentation_definition,
        submission: messageToProcess.attachments.find(
          (attachment) =>
            attachment?.data?.json?.presentation_submission?.definition_id ===
            request.data.json.presentation_definition.id,
        ),
      }));

    console.log('[STEP-5] submissionsToCheck count:', submissionsToCheck.length);
    submissionsToCheck.forEach((s: any, i: number) => {
      console.log(`[STEP-5] submission[${i}] found:`, !!s.submission, 'defId:', s.presentationDefinition?.id);
    });

    // Fallback: if definition_id mismatch, match by position (SD-JWT wallets may generate new UUIDs)
    submissionsToCheck.forEach((s, i) => {
      if (isNil(s.submission)) {
        const fallback = messageToProcess.attachments.find(
          (att) => att.data && att.data.json && att.data.json.presentation_submission,
        );
        if (fallback) {
          console.log(`[STEP-5] definition_id mismatch, using positional fallback for submission[${i}]`);
          s.submission = fallback;
        }
      }
    });

    let result = false;

    const verificationResultCallback = callbacks[Actor.Verifier].credentialVerificationResult;
    let vcs = [];

    const allSubmissionsFound = submissionsToCheck.every(
      (submissionToCheck) => !isNil(submissionToCheck.submission),
    );
    console.log('[STEP-5] allSubmissionsFound:', allSubmissionsFound);

    if (allSubmissionsFound) {
      for await (const submissionToCheck of submissionsToCheck) {
        console.log('[STEP-5] 🔵 Calling verifyPresentation utility...');
        console.log('[STEP-5] submission definition_id:', submissionToCheck.submission?.data?.json?.presentation_submission?.definition_id);

        let verify = await verifyPresentation(
          submissionToCheck.presentationDefinition,
          submissionToCheck.submission,
          callbacks[Actor.Verifier].verifyCredential
        );
        console.log('[STEP-5] ✅ verifyPresentation utility result:', verify?.result);

        result = verify.result;

        for (let vc of verify.vcs) {
          vcs.push(vc);
        }

        if (!result) {

          if (verificationResultCallback) {
            verificationResultCallback({
              result: verify.result,
              error: verify.errors,
              thid: messageToProcess.thid,
              vcs: verify.vcs,
              message: messageToProcess,
            })
          }

          return {
            responseType: WACIMessageResponseType.ReplyThread,
            message: {
              type: WACIMessageType.ProblemReport,
              id: createUUID(),
              thid: messageToProcess.id,
              from: verifierDID,
              to: [holderDID],
              body: problemReport.presentProofMessage(
                verify.error.name,
                verify.error.description,
              ),
            },
          };
        }
      }

      if (result) {
        if (verificationResultCallback) {
          verificationResultCallback({
            result: result,
            error: null,
            thid: messageToProcess.thid,
            vcs: vcs,
            message: messageToProcess,
          })
        }

        response.message.body.status = AckStatus.Ok;
        return response;
      }
    }
  }
}
