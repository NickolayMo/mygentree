import { Gender, InfoNode, LiveEvent, Node, PersonDocuments, RelType, Relation } from "../../renderTree/types"

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
}

export const updatePerson = (values: UpdateContext, node: Node, callback: (nodeList: any) => any) => {
  const formVals = values as UpdateContext
  fetch(
    process.env.REACT_APP_TREE_APP_SERVICE_URL + "/web/api/v1/tree/person/update",
    {
      method: "POST",
      body: JSON.stringify({
        "userId": "HkqEDLvxE",
        "treeId": "1",
        "action": "UPDATE",
        "nodeId": node.id,
        "context": { ...formVals }
      }),
      headers: {
        "Content-Type": "application/json",
      }
    }
  ).then((res) => res.json())
    .then((res) => res.data)
    .then((res) => callback(res.relatives))
}


const createPerson = (values: UpdateContext, node: Node, callback: (nodeList: any) => any) => {
  const formVals = values as UpdateContext
  fetch(
    process.env.REACT_APP_TREE_APP_SERVICE_URL + "/web/api/v1/tree/person/update",
    {
      method: "POST",
      body: JSON.stringify({
        "userId": "HkqEDLvxE",
        "treeId": "1",
        "action": "CREATE",
        "nodeId": node.id,
        "context": { ...formVals }
      }),
      headers: {
        "Content-Type": "application/json",
      }
    }
  ).then((res) => res.json())
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
  return createPerson(values, node, callback)
}

export const addSpouse = (values: UpdateContext, node: Node, callback: (nodeList: any) => any) => {
  return createPerson(values, node, callback)
}