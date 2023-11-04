package com.mygentree.service

import com.mygentree.data.User
import com.mygentree.dto.request.SignUpRequest

interface IUserService {
    fun createUser(rq: SignUpRequest): User

    fun isUserEmailInUse(rq: SignUpRequest): Boolean
    fun isUserEmailInUse(email: String): Boolean
    fun isUserUsernameInUse(rq: SignUpRequest): Boolean
    fun isUserUsernameInUse(username: String): Boolean
}