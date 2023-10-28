package com.mygentree.repository

import com.mygentree.data.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository: JpaRepository<User, Long> {
    fun findByEmail(email: String): User?
    fun findByEmailOrUsername(email: String, userName: String): User?
    fun existByEmail(email: String): Boolean
    fun existByUsername(email: String): User
}