import {SignInRequest} from "../components/SignInForm/SignInRequest";
import {SignUpRequest} from "../components/SignUpForm/SignUpRequest";
import {ACCESS_TOKEN, API_BASE_URL} from "../constants";
import {
    checkEmailAvailabilityRoute,
    checkUsernameAvailabilityRoute,
    getCurrentUserRoute, getTreeListRoute, getTreeRoute,
    signInRoute,
    signUpRoute, updateRoute
} from "./routes";
import {Gender, LiveEvent, PersonDocuments, Relation} from "../renderTree/types";
import {UpdateRequest} from "../components/PersonForm/UpdateRequest";


const request = (url: RequestInfo | URL, options: RequestInit | undefined) => {
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
export const getCurrentUser = () => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    if (!token) {
        return Promise.reject("Авторизационный токен не найден")
    }
    return request(
        API_BASE_URL + getCurrentUserRoute,
        {
            method: "GET"
        }
    )
}


export const signIn = (signInRequest: SignInRequest) =>
    request(
        API_BASE_URL + signInRoute,
        {
            method: "POST",
            body: JSON.stringify(signInRequest)
        }
    )

export const signUp = (signUpRequest: SignUpRequest) =>
    request(
        API_BASE_URL + signUpRoute,
        {
            method: "POST",
            body: JSON.stringify(signUpRequest)
        }
    )

export const checkUsernameAvailability = (username: string) =>
    request(
        API_BASE_URL + checkUsernameAvailabilityRoute + `?username=${username}`,
        {
            method: "GET",
        }
    )

export const checkEmailAvailability = (email: string) => {
    return request(
        API_BASE_URL + checkEmailAvailabilityRoute + `?email=${email}`,
        {
            method: "GET",
        }
    )
}

export const getTreeList = () => {
    return request(
        API_BASE_URL + getTreeListRoute,
        {
            method: "GET",
        }
    )
}

export const getTreeNodes = (treeId: string) =>
    request(
        API_BASE_URL + getTreeRoute,
        {
            method: "POST",
            body: JSON.stringify({userId: 1, treeId: treeId}),
        }
    )


export const doUpdatePerson = (rq: UpdateRequest) =>
    request(
        API_BASE_URL + updateRoute,
        {
            method: "POST",
            body: JSON.stringify(rq)
        }
    )

