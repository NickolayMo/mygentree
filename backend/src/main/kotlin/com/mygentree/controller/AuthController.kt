package com.mygentree.controller

import com.mygentree.dto.request.LoginRequest
import com.mygentree.dto.request.SignUpRequest
import com.mygentree.dto.response.ApiResponse
import com.mygentree.dto.response.AuthResponse
import com.mygentree.security.JwtTokenProvider
import com.mygentree.service.IUserService
import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.support.ServletUriComponentsBuilder
import java.net.URI


@RestController
@RequestMapping("/api/v1/auth/")
class AuthController(
    @Autowired
    val authenticationManager: AuthenticationManager,
    @Autowired
    val jwtTokenProvider: JwtTokenProvider,
    @Autowired
    val userService: IUserService
) {
    @PostMapping("/sign_in")
    fun signIn(
        @Valid
        @RequestBody
        rq: LoginRequest
    ): ResponseEntity<AuthResponse> {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(
                rq.usernameOrEmail,
                rq.password
            )
        )
        SecurityContextHolder.getContext().authentication = authentication
        val token = jwtTokenProvider.generateToken(authentication)
        return ResponseEntity.ok(AuthResponse(token))
    }

    @PostMapping("/sign_up")
    fun singUp(
        @Valid
        @RequestBody
        rq: SignUpRequest
    ): ResponseEntity<ApiResponse<String>> {
        if (userService.isUserEmailInUse(rq)) {
            return ResponseEntity(
                ApiResponse(
                    success = false,
                    data = null,
                    error = "Адрес почты уже используется"

                ), HttpStatus.BAD_REQUEST
            )
        }
        if (userService.isUserUsernameInUse(rq)) {
            return ResponseEntity(
                ApiResponse(
                    success = false,
                    data = null,
                    error = "Имя уже используется, выберите другое"

                ), HttpStatus.BAD_REQUEST
            )
        }
        val user = userService.createUser(rq)
        val location: URI = ServletUriComponentsBuilder
            .fromCurrentContextPath().path("api/v1/users/me")
            .buildAndExpand(user.id).toUri()
        return ResponseEntity.created(location).body(
            ApiResponse(
                success = true,
                data = "Пользователь зарегистрирован",
                error = null
            )
        )
    }
}