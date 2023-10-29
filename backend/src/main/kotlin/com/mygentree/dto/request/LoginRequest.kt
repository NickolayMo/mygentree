package com.mygentree.dto.request

import jakarta.validation.constraints.NotBlank

class LoginRequest(
    @NotBlank
    val usernameOrEmail: String,
    @NotBlank
    val password: String
)