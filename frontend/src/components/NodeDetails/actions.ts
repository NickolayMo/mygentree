import {Node} from "../../renderTree/types"
import {doUpdatePerson} from "../../utils/api";
import {UpdateAction} from "../PersonForm/UpdateRequest";

export const deleteUser = (node: Node, callback: (nodes: readonly Readonly<Node>[]) => void) => {
    doUpdatePerson({
        action: UpdateAction.DELETE,
        context: {
            nodeId: node.id
        },
        nodeId: node.id,
        treeId: "1",
        userId: ""

    })
        .then((res) => res.data)
        .then((res) => callback(res.relatives))
}