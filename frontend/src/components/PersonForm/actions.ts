import {Gender, LiveEvent, Node, PersonDocuments, RelType, Relation} from "../../renderTree/types"
import {doUpdatePerson} from "../../utils/api";
import {UpdateAction} from "./UpdateRequest";

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

export const updatePerson = (values: UpdateContext, node: Node, callback: (nodeList: any) => any) => {
    const formVals = values as UpdateContext
    doUpdatePerson({
        action: UpdateAction.UPDATE,
        context: {...formVals},
        nodeId: node.id,
        treeId: "1",
        userId: ""

    })
        .then((res) => res.data)
        .then((res) => callback(res.relatives))
}


const createPerson = (values: UpdateContext, node: Node, callback: (nodeList: any) => any) => {
    const formVals = values as UpdateContext
    doUpdatePerson({
        action: UpdateAction.CREATE,
        context: {...formVals},
        nodeId: node.id,
        treeId: "1",
        userId: ""

    })
        .then((res) => res.data)
        .then((res) => callback(res.relatives))
}


export const addChild = (values: UpdateContext, node: Node, callback: (nodeList: any) => any) => {
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
    return createPerson(values, node, callback)
}

export const addParent = (values: UpdateContext, node: Node, callback: (nodeList: any) => any) => {
    const children = [
        {
            id: node.id,
            type: RelType.blood
        }
    ]
    values.children = children
    return createPerson(values, node, callback)
}

export const addSpouse = (values: UpdateContext, node: Node, callback: (nodeList: any) => any) => {
    const spouse = [
        {
            id: node.id,
            type: RelType.blood
        }
    ]

    values.spouses = spouse
    return createPerson(values, node, callback)
}