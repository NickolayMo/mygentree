package com.mygentree.repository

import com.mygentree.data.Role
import com.mygentree.data.RoleName
import org.springframework.data.jpa.repository.JpaRepository

interface RoleRepository: JpaRepository<Role, Long> {
    fun findByName(name:RoleName): Role
}