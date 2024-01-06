import {UpdateAction, UpdateRequest} from "../models/UpdateRequest";
import {API_BASE_URL} from "../constants";
import {updateRoute} from "../utils/routes";
import {Gender, LiveEvent, Node, PersonDocuments, Relation, RelType} from "../renderTree/types";
import {request} from "../utils/api";

export const doUpdatePerson = (rq: UpdateRequest) =>
    request(
        updateRoute,
        {
            method: "POST",
            body: JSON.stringify(rq)
        }
    )
type UpdateContext = {
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
export const updatePerson = (values: UpdateContext, nodeId: string, treeId: string,) => {
    const formVals = values as UpdateContext
    return doUpdatePerson({
        action: UpdateAction.UPDATE,
        context: {...formVals},
        nodeId: nodeId,
        treeId: treeId,

    })
}
const createPerson = (values: UpdateContext, nodeId: string, treeId: string) => {
    const formVals = values as UpdateContext
    return doUpdatePerson({
        action: UpdateAction.CREATE,
        context: {...formVals},
        nodeId: nodeId,
        treeId: treeId,
    })
}
export const addChild = (values: UpdateContext, node: Node, treeId: string) => {
    const parents = [
        {
            id: node.id,
            type: RelType.blood
        }
    ]
    if (node.spouses.length > 0) {
        const spouse = node.spouses[0]
        parents.push(
            {
                id: spouse.id,
                type: RelType.blood
            }
        )
    }
    values.parents = parents
    return createPerson(values, node.id, treeId)
}
export const addParent = (values: UpdateContext, node: Node, treeId: string) => {
    const children = [
        {
            id: node.id,
            type: RelType.blood
        }
    ]
    values.children = children
    return createPerson(values, node.id, treeId)
}
export const addSpouse = (values: UpdateContext, node: Node, treeId: string) => {
    const spouse = [
        {
            id: node.id,
            type: RelType.blood
        }
    ]

    values.spouses = spouse
    return createPerson(values, node.id, treeId)
}
export const createNewPerson = (values: UpdateContext, treeId: string) => {
    return createPerson(values, "", treeId)
}
export const deleteUser = (node: Node, treeId: string, callback: (nodes: readonly Readonly<Node>[]) => void) => {
    doUpdatePerson({
        action: UpdateAction.DELETE,
        context: {
            nodeId: node.id
        },
        nodeId: node.id,
        treeId: treeId,

    })
        .then((res) => res.data)
        .then((res) => callback(res.relatives))
}