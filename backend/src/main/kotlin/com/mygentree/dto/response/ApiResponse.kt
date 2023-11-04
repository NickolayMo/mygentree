package com.mygentree.dto.response


class ApiResponse<T>(
    val success: Boolean,
    val data: T?,
    val error: Any?
)