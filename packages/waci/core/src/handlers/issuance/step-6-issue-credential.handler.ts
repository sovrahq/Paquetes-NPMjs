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
import { createUUID } from '../../utils';
import { ProblemReportMessage } from '../../types/problem-report';

@RegisterHandler(Actor.Holder, WACIMessageType.IssueCredential)
export class IssueCredentialHandler implements WACIMessageHandler {
  async handle(
    messageThread: WACIMessage[],
    callbacks: any,
  ): Promise<WACIMessageHandlerResponse> {
    const message = messageThread[messageThread.length - 1];

    // Extract credential manifest from the OfferCredential message in the thread
    // This is needed because the holder may not have the manifest stored (e.g., DWN message replay)
    const offerMessage = messageThread.find(
      (m) => m.type === WACIMessageType.OfferCredential,
    );
    const threadManifests = offerMessage?.attachments?.filter(
      (a) => !isNil(a?.data?.json?.credential_manifest),
    );

    const problemReport = new ProblemReportMessage();
    const fulfillmentAcceptance = await callbacks[
      Actor.Holder
    ].handleCredentialFulfillment({
      message,
      credentialFulfillment: message.attachments,
      threadManifests,
    });
    const holderDID = message.to[0];
    const issuerDID = message.from;

    //TODO define when this is neccesary
    if (!fulfillmentAcceptance) {
      return {
        responseType: WACIMessageResponseType.ReplyThread,
        message: {
          type: WACIMessageType.ProblemReport,
          id: createUUID(),
          thid: message.thid,
          from: holderDID,
          to: [issuerDID],
          body: problemReport.presentProofMessage(
            'Holder did not accept the credential',
          ),
        },
      };
    }

    return {
      responseType: WACIMessageResponseType.ReplyThread,
      message: {
        type: WACIMessageType.IssuanceAck,
        id: createUUID(),
        thid: message.thid,
        from: holderDID,
        to: [issuerDID],
        body: {
          status: AckStatus.Ok,
        },
      },
    };
  }
}
