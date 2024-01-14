package com.mygentree.repository

import com.mygentree.data.AppRole
import com.mygentree.data.AppRoleName
import org.springframework.data.jpa.repository.JpaRepository

interface AppRoleRepository: JpaRepository<AppRole, Long> {
    fun findByName(name:AppRoleName): AppRole
}