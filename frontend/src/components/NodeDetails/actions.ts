import { updateRoute } from "../../utils/routes"
import { Node } from "../../renderTree/types"

export const deleteUser= (node: Node, callback: (nodes: readonly Readonly<Node>[]) => void) => {
    fetch(
        process.env.REACT_APP_TREE_APP_SERVICE_URL + updateRoute,
        {
            method: "POST",
            body: JSON.stringify({
                "userId": "HkqEDLvxE",
                "treeId": "1",
                "action": "DELETE",
                "nodeId": node.id,
                "context": {
                    "nodeId": node.id
                }
            }),
            headers: {
                "Content-Type": "application/json",
            }
        }
    ).then((res) => res.json())
    .then((res) => res.data)
    .then((res) => callback(res.relatives))
}