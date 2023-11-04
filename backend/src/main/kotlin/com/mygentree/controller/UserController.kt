package com.mygentree.controller

import com.mygentree.dto.response.ApiResponse
import com.mygentree.dto.response.UserSummary
import com.mygentree.security.CurrentUser
import com.mygentree.security.UserPrincipal
import com.mygentree.service.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("api/v1/user")
class UserController(
    @Autowired
    val userService: UserService
) {
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    fun getCurrentUser(
        @CurrentUser user: UserPrincipal
    ): ResponseEntity<ApiResponse<UserSummary>> {
        val summary = UserSummary(
            id = user.id,
            name = user.name,
            userName = user.userUsername,
            email = user.userEmail
        )
        return ResponseEntity.ok(ApiResponse(
            success = true,
            data = summary,
            error = null
        ))
    }

    @GetMapping("/username_availability")
    fun checkUsernameAvailability(@RequestParam(value = "username") username: String):ResponseEntity<ApiResponse<Boolean>> {
        val inUse = userService.isUserUsernameInUse(username)
        return ResponseEntity.ok(
            ApiResponse(
            success = true,
            data = !inUse,
            error = null
        )
        )
    }
    @GetMapping("/email_availability")
    fun checkEmailAvailability(@RequestParam(value = "email") email: String):ResponseEntity<ApiResponse<Boolean>> {
        val inUse = userService.isUserEmailInUse(email)
        return ResponseEntity.ok(ApiResponse(
            success = true,
            data = !inUse,
            error = null
        ))
    }
}