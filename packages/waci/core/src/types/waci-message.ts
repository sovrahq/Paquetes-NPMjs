enum SharedMessageType {
  OutOfBandInvitation = 'https://didcomm.org/out-of-band/2.0/invitation',
}

enum IssuanceMessageType {
  ProposeCredential = 'https://didcomm.org/issue-credential/3.0/propose-credential',
  OfferCredential = 'https://didcomm.org/issue-credential/3.0/offer-credential',
  RequestCredential = 'https://didcomm.org/issue-credential/3.0/request-credential',
  IssueCredential = 'https://didcomm.org/issue-credential/3.0/issue-credential',
  IssuanceAck = 'https://didcomm.org/issue-credential/3.0/ack',
  ProblemReport = 'https://didcomm.org/report-problem/2.0/problem-report',
}

enum PresentationMessageType {
  ProposePresentation = 'https://didcomm.org/present-proof/3.0/propose-presentation',
  RequestPresentation = 'https://didcomm.org/present-proof/3.0/request-presentation',
  PresentProof = 'https://didcomm.org/present-proof/3.0/presentation',
  PresentationAck = 'https://didcomm.org/present-proof/3.0/ack',
  ProblemReport = 'https://didcomm.org/report-problem/2.0/problem-report',
}

// --- DIDComm v1 message types ---

enum SharedMessageTypeV1 {
  OutOfBandInvitation = 'https://didcomm.org/out-of-band/1.0/invitation',
}

enum IssuanceMessageTypeV1 {
  ProposeCredential = 'https://didcomm.org/issue-credential/1.0/propose-credential',
  OfferCredential = 'https://didcomm.org/issue-credential/1.0/offer-credential',
  RequestCredential = 'https://didcomm.org/issue-credential/1.0/request-credential',
  IssueCredential = 'https://didcomm.org/issue-credential/1.0/issue-credential',
  IssuanceAck = 'https://didcomm.org/issue-credential/1.0/ack',
  ProblemReport = 'https://didcomm.org/report-problem/1.0/problem-report',
}

enum PresentationMessageTypeV1 {
  ProposePresentation = 'https://didcomm.org/present-proof/1.0/propose-presentation',
  RequestPresentation = 'https://didcomm.org/present-proof/1.0/request-presentation',
  PresentProof = 'https://didcomm.org/present-proof/1.0/presentation',
  PresentationAck = 'https://didcomm.org/present-proof/1.0/ack',
  ProblemReport = 'https://didcomm.org/report-problem/1.0/problem-report',
}

export const WACIMessageTypeV1 = {
  ...SharedMessageTypeV1,
  ...IssuanceMessageTypeV1,
  ...PresentationMessageTypeV1,
};

// --- Version detection & normalization ---

export enum DIDCommVersion {
  V1 = 'v1',
  V2 = 'v2',
}

const V1_TO_V2_MAP: Record<string, string> = {
  [SharedMessageTypeV1.OutOfBandInvitation]: SharedMessageType.OutOfBandInvitation,
  [IssuanceMessageTypeV1.ProposeCredential]: IssuanceMessageType.ProposeCredential,
  [IssuanceMessageTypeV1.OfferCredential]: IssuanceMessageType.OfferCredential,
  [IssuanceMessageTypeV1.RequestCredential]: IssuanceMessageType.RequestCredential,
  [IssuanceMessageTypeV1.IssueCredential]: IssuanceMessageType.IssueCredential,
  [IssuanceMessageTypeV1.IssuanceAck]: IssuanceMessageType.IssuanceAck,
  [IssuanceMessageTypeV1.ProblemReport]: IssuanceMessageType.ProblemReport,
  [PresentationMessageTypeV1.ProposePresentation]: PresentationMessageType.ProposePresentation,
  [PresentationMessageTypeV1.RequestPresentation]: PresentationMessageType.RequestPresentation,
  [PresentationMessageTypeV1.PresentProof]: PresentationMessageType.PresentProof,
  [PresentationMessageTypeV1.PresentationAck]: PresentationMessageType.PresentationAck,
  // ProblemReport v1 already mapped via IssuanceMessageTypeV1.ProblemReport (same URI)
};

const V2_TO_V1_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(V1_TO_V2_MAP).map(([k, v]) => [v, k]),
);

export function detectDIDCommVersion(type: string): DIDCommVersion {
  if (/\/1\.0\//.test(type)) return DIDCommVersion.V1;
  return DIDCommVersion.V2;
}

export function normalizeToV2(type: string): string {
  return V1_TO_V2_MAP[type] || type;
}

export function convertToVersion(type: string, target: DIDCommVersion): string {
  if (target === DIDCommVersion.V1) {
    return V2_TO_V1_MAP[type] || type;
  }
  return V1_TO_V2_MAP[type] || type;
}

export const WACIMessageType = {
  ...SharedMessageType,
  ...IssuanceMessageType,
  ...PresentationMessageType,
};

// eslint-disable-next-line no-redeclare
export type WACIMessageType =
  | SharedMessageType
  | IssuanceMessageType
  | PresentationMessageType;

export enum GoalCode {
  Issuance = 'streamlined-vc',
  Presentation = 'streamlined-vp',
}

export const enum AckStatus {
  Ok = 'OK',
  Fail = 'FAIL',
  Pending = 'PENDING',
}

export type WACIMessage = {
  type: WACIMessageType;
  id: string;
  from: string;
  to?: string[];
  body?: any;
  pthid?: string;
  thid?: string;
  attachments?: any[];
};

export const enum WACIMessageResponseType {
  CreateThread,
  ReplyThread,
}

export type WACIMessageHandlerResponse = {
  message: WACIMessage;
  responseType: WACIMessageResponseType;
};

export type WACIResponse = {
  message: WACIMessage;
  target: string;
  responseType: WACIMessageResponseType;
};

export interface WACIMessageHandler {
  handle(
    messageThread: WACIMessage[],
    callbacks: any,
  ): Promise<WACIMessageHandlerResponse | void>;
}
