package com.mygentree.presentation.web.controller.api.v1

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/web/api/v1/")
class TreeController {
    @PostMapping("/tree")
    fun index(@RequestBody request: TreeRequest) = mock
}

data class TreeRequest(
    val id: String
)
