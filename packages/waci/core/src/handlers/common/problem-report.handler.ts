import { RegisterHandler } from '../decorators/register-handler.decorator';
import {
  WACIMessage,
  WACIMessageHandler,
  WACIMessageType,
  Actor,
} from '../../types';

@RegisterHandler(Actor.Holder, WACIMessageType.ProblemReport)
export class ProblemReportHandler implements WACIMessageHandler {
  async handle(messageThread: WACIMessage[], callbacks: any): Promise<void> {
    const message = messageThread[messageThread.length - 1];
    await callbacks[Actor.Holder].handlePresentationAck({ status: message.body, message });
  }
}