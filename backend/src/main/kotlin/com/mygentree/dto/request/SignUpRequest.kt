package com.mygentree.dto.request

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

class SignUpRequest(
    @NotBlank
    @Size(min = 1, max = 100)
    val name: String,
    @NotBlank
    @Size(min = 1, max = 100)
    val username: String,
    @NotBlank
    @Size(min = 1, max = 100)
    @Email
    val email: String,
    @NotBlank
    @Size(min = 1, max = 100)
    val password: String
)