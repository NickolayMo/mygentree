import { Node } from "../../renderTree/types"

export const deleteUser= (node: Node, callback: () => void) => {
    fetch(
        process.env.REACT_APP_TREE_APP_SERVICE_URL + "/web/api/v1/tree/update/person",
        {
            method: "POST",
            body: JSON.stringify({
                "userId": "HkqEDLvxE",
                "treeId": "1",
                "action": "DELETE",
                "nodeId": node.id,
                "context": {
                }
            }),
            headers: {
                "Content-Type": "application/json",
            }
        }
    ).then((res) => res.json())
        .then((res) => res.data)
        .then((res) => callback())
}