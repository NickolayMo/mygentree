import { InfoNode, Node } from "../../renderTree/types"

export const updatePerson = (values: InfoNode, node: Node, callback: (nodeList: any) => any) => {
    const formVals = values as InfoNode
    fetch(
      process.env.REACT_APP_TREE_APP_SERVICE_URL + "/web/api/v1/tree/update/person",
      {
        method: "POST",
        body: JSON.stringify({
          "userId": "HkqEDLvxE",
          "treeId": "1",
          "action": "UPDATE",
          "nodeId": node.id,
          "context": {
            "avatar": formVals.avatar,
            "firstName": formVals.firstName,
            "middleName": formVals.middleName,
            "lastName": formVals.lastName,
            "birthDate": formVals.birthDate,
            "occupation": formVals.occupation,
            "location": formVals.location
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


  export const createPerson = (values: InfoNode, node: Node, callback: (nodeList: any) => any) => {
    const formVals = values as InfoNode
    console.log(formVals)
    fetch(
      process.env.REACT_APP_TREE_APP_SERVICE_URL + "/web/api/v1/tree/update/person",
      {
        method: "POST",
        body: JSON.stringify({
          "userId": "HkqEDLvxE",
          "treeId": "1",
          "action": "CREATE",
          "nodeId": node.id,
          "context": {
            "avatar": formVals.avatar,
            "firstName": formVals.firstName,
            "middleName": formVals.middleName,
            "lastName": formVals.lastName,
            "birthDate": formVals.birthDate,
            "occupation": formVals.occupation,
            "location": formVals.location
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