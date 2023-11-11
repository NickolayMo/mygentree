package com.mygentree.dto.request

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import kotlin.math.min


class TreeCreateRequest(
    @NotBlank
    @Size(min=1, max = 100)
    val treeName: String,
    val extraInfo: String?
)