package com.mygentree.repository

import com.mygentree.data.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface UserRepository: JpaRepository<User, Long> {
    fun findByEmail(email: String): Optional<User>
    fun findByEmailOrUsername(email: String, userName: String): Optional<User>
    fun existsByEmail(email: String): Boolean
    fun existsByUsername(email: String): Boolean
}