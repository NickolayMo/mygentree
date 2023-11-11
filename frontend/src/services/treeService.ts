import {API_BASE_URL} from "../constants";
import {crateTreeRoute, getTreeListRoute, getTreeRoute} from "../utils/routes";
import {request} from "../utils/api";

export const getTreeList = () => {
    return request(
        getTreeListRoute,
        {
            method: "GET",
        }
    )
}
export const getTreeNodes = (treeId: string) =>
    request(
        getTreeRoute,
        {
            method: "POST",
            body: JSON.stringify({userId: 1, treeId: treeId}),
        }
    )
export const createTree = (name: string) =>
    request(
        crateTreeRoute,
        {
            method: "POST",
            body: JSON.stringify({
                treeName: name,
                extraInfo: "{}"
            })
        }
    )