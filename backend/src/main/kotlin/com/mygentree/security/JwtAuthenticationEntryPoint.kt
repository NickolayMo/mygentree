package com.mygentree.security

import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.security.core.AuthenticationException
import org.springframework.security.web.AuthenticationEntryPoint
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service


@Component
class JwtAuthenticationEntryPoint: AuthenticationEntryPoint {
    companion object {
        val logger: Logger = LoggerFactory.getLogger(JwtAuthenticationEntryPoint::class.java)
    }

    override fun commence(
        httpServletRequest: HttpServletRequest?,
        httpServletResponse: HttpServletResponse,
        e: AuthenticationException
    ) {
        logger.error("Responding with unauthorized error. Message - {}", e.message)
        httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, e.message)
    }
}