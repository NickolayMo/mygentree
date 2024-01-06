import {ACCESS_TOKEN} from "../constants";
import {deletePhotoRoute, uploadPhotoRoute} from "../utils/routes";
import {UploadFile} from "antd/es/upload/interface";

const authHeaders = () => {
    if ( localStorage.getItem(ACCESS_TOKEN)) {
        return {
            'Authorization': 'Bearer ' + localStorage.getItem(ACCESS_TOKEN)
        }
    }
    return undefined
}
export const uploadProps = {
    action: uploadPhotoRoute,
    listType: "picture-card",
    headers:  authHeaders(),
}

export const removePhoto = async (file: UploadFile) => {
    const headers = new Headers()

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }
    const options = {
        method: "DELETE"
    }
    const opt = {
        ...options,
        headers
    }
    const url = deletePhotoRoute + file.fileName
    let response = await fetch(url, opt);
    let json = await response.json();
    if (!response.ok) {
        return Promise.reject(json);
    }
    return json;
}