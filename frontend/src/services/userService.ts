import {ACCESS_TOKEN, API_BASE_URL} from "../constants";
import {
    checkEmailAvailabilityRoute,
    checkUsernameAvailabilityRoute,
    getCurrentUserRoute,
    signInRoute,
    signUpRoute
} from "../utils/routes";
import {SignUpRequest} from "../models/SignUpRequest";
import {SignInRequest} from "../models/SignInRequest";
import {request} from "../utils/api";

export const getCurrentUser = () => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    if (!token) {
        return Promise.reject("Авторизационный токен не найден")
    }
    return request(
        getCurrentUserRoute,
        {
            method: "GET"
        }
    )
}
export const signIn = (signInRequest: SignInRequest) =>
    request(
        signInRoute,
        {
            method: "POST",
            body: JSON.stringify(signInRequest)
        }
    )
export const signUp = (signUpRequest: SignUpRequest) =>
    request(
        signUpRoute,
        {
            method: "POST",
            body: JSON.stringify(signUpRequest)
        }
    )
export const checkUsernameAvailability = (username: string) =>
    request(
        checkUsernameAvailabilityRoute + `?username=${username}`,
        {
            method: "GET",
        }
    )
export const checkEmailAvailability = (email: string) => {
    return request(
        checkEmailAvailabilityRoute + `?email=${email}`,
        {
            method: "GET",
        }
    )
}