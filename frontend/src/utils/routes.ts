import {API_BASE_URL} from "../constants";

export const updateRoute = API_BASE_URL + "/api/v1/person/update"
export const getTreeRoute = API_BASE_URL + "/api/v1/tree/get"
export const getCurrentUserRoute = API_BASE_URL + "/api/v1/user/me"
export const signInRoute = API_BASE_URL + "/api/v1/auth/sign_in"
export const signUpRoute = API_BASE_URL + "/api/v1/auth/sign_up"
export const checkUsernameAvailabilityRoute = API_BASE_URL + "/api/v1/user/username_availability"
export const checkEmailAvailabilityRoute = API_BASE_URL + "/api/v1/user/email_availability"
export const getTreeListRoute = API_BASE_URL + "/api/v1/tree/get/list"
export const crateTreeRoute = API_BASE_URL + "/api/v1/tree/add"