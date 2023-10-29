package com.mygentree.security

import com.mygentree.data.User
import com.mygentree.exception.ResourceNotFoundException
import com.mygentree.repository.UserRepository
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service



@Service
class CustomUserDetailsService: UserDetailsService {
    @Autowired
    val userRepository: UserRepository? = null

    @Transactional
    @Throws(UsernameNotFoundException::class)
    override fun loadUserByUsername(usernameOrEmail: String): UserDetails? {
        // Let people login with either username or email
        val user: User = userRepository!!.findByEmailOrUsername(usernameOrEmail, usernameOrEmail)
            .orElseThrow { UsernameNotFoundException("User not found with username or email : $usernameOrEmail") }
        return UserPrincipal.create(user)
    }

    @Transactional
    fun loadUserById(id: Long): UserDetails? {
        val user: User = userRepository!!.findById(id).orElseThrow{
            ResourceNotFoundException("User", "id", id)
        }
        return UserPrincipal.create(user)
    }
}