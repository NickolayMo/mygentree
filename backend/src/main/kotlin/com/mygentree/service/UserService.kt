package com.mygentree.service

import com.mygentree.data.AppRoleName
import com.mygentree.data.User
import com.mygentree.dto.request.SignUpRequest
import com.mygentree.repository.AppRoleRepository
import com.mygentree.repository.UserRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
    @Autowired
    val appRoleRepository: AppRoleRepository,
    @Autowired
    val userRepository: UserRepository,
    @Autowired
    val passwordEncoder: PasswordEncoder
) : IUserService {
    override fun createUser(rq: SignUpRequest): User {
        val role = appRoleRepository.findByName(AppRoleName.ROLE_USER)
        val user = User(
            name = rq.name,
            email = rq.email,
            username = rq.username,
            password = passwordEncoder.encode(rq.password),
            roles = setOf(role),
            isActive = true
        )
        val result = userRepository.save(user)
        return result
    }

    override fun isUserEmailInUse(rq: SignUpRequest): Boolean {
        return userRepository.existsByEmail(rq.email)
    }

    override fun isUserEmailInUse(email: String): Boolean {
        return userRepository.existsByEmail(email)
    }

    override fun isUserUsernameInUse(rq: SignUpRequest): Boolean {
        return userRepository.existsByUsername(rq.username)
    }

    override fun isUserUsernameInUse(username: String): Boolean {
        return userRepository.existsByUsername(username)
    }
}