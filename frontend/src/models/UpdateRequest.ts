import {Gender, LiveEvent, PersonDocuments, Relation} from "../renderTree/types";

export type UpdateRequest = {
    treeId: string,
    action: string,
    nodeId: string|undefined,
    context: UpdateContext
}

export enum UpdateAction {
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    CREATE = "CREATE"
}

export type UpdateContext = {
    avatar?: string
    firstName?: string,
    middleName?: string,
    lastName?: string,
    occupation?: string,
    location?: string,
    birthDate?: string
    liveEvents?: readonly LiveEvent[];
    personDocuments?: readonly PersonDocuments[];
    description?: string,
    gender?: Gender,
    parents?: readonly Relation[];
    children?: readonly Relation[];
    siblings?: readonly Relation[];
    spouses?: readonly Relation[];
    nodeId?: string;
}