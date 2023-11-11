import {ACCESS_TOKEN} from "../constants";


export const request = (url: RequestInfo | URL, options: RequestInit | undefined) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const opt = {
        ...options,
        headers
    }

    return fetch(url, opt)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
}


