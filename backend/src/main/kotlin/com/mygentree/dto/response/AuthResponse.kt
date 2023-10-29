package com.mygentree.dto.response

class AuthResponse(
    val accessToken: String?,
    val tokenType: String = "Bearer"
)