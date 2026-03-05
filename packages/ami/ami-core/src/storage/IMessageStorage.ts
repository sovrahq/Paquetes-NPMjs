import { Message } from "../message/message";
import { IDIDCommThreadStorage , IDIDCommMessageStorage } from "@sovrahq/did-core";

export interface IMessageStorage extends IDIDCommMessageStorage<Message>{

}

export interface IMessageThreadStorage extends IDIDCommThreadStorage<Message>{

}

