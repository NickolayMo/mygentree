package com.mygentree.security

import org.springframework.security.core.annotation.AuthenticationPrincipal


@Target(AnnotationTarget.TYPE_PARAMETER,AnnotationTarget.TYPE)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
@AuthenticationPrincipal
annotation class CurrentUser