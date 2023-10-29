package com.mygentree.security

import com.fasterxml.jackson.annotation.JsonIgnore
import com.mygentree.data.User
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails


class UserPrincipal(
    val id: Long?,
    val name: String,
    val userUsername: String,
    @JsonIgnore
    val userEmail: String,
    @JsonIgnore
    val userPassword: String,
    val userAuthorities: MutableCollection<GrantedAuthority>

): UserDetails {
    companion object{
        fun create(user: User): UserPrincipal {
            val authorities: MutableCollection<GrantedAuthority> = user.roles!!.map { role ->
                SimpleGrantedAuthority(role.name.toString())
            }.toMutableList()
            return UserPrincipal(
                id = user.id,
                name = user.name,
                userUsername = user.username,
                userEmail = user.email,
                userPassword = user.password,
                userAuthorities = authorities
            )
        }
    }

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        return userAuthorities
    }

    override fun getPassword(): String {
        return userPassword
    }

    override fun getUsername(): String {
        return userUsername
    }

    override fun isAccountNonExpired(): Boolean {
       return true
    }

    override fun isAccountNonLocked(): Boolean {
       return true
    }

    override fun isCredentialsNonExpired(): Boolean {
        return true
    }

    override fun isEnabled(): Boolean {
        return true
    }
}