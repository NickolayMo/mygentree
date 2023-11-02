import { SignInRequest } from "../components/SignInForm/SignInRequest";
import { SignUpRequest } from "../components/SignUpForm/SignUpRequest";
import { ACCESS_TOKEN, API_BASE_URL } from "../constants";
import { signInRoute, signUpRoute } from "./routes";



const request = (url: RequestInfo | URL, options: RequestInit | undefined) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if (localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(url, options)
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
        API_BASE_URL + getCurrentUser,
        {
            method: "GET"
        }
    )
}


export const signIn = (signInRequest: SignInRequest) => {
    return request(
        API_BASE_URL + signInRoute,
        {
            method: "POST",
            body: JSON.stringify(signInRequest)
        }
    )
}

export const signUp = (signUpRequest: SignUpRequest) => {
    return request(
        API_BASE_URL + signUpRoute,
        {
            method: "POST",
            body: JSON.stringify(signUpRequest)
        }
    )
}

export const checkUsernameAvailability = (username: string)=>{
    return request(
        API_BASE_URL + signUpRoute,
        {
            method: "POST"
        }
    )
}

export const checkEmailAvailability = (email: string)=>{
    return request(
        API_BASE_URL + signUpRoute,
        {
            method: "POST"
        }
    )
}