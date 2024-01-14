package com.mygentree.repository

import com.mygentree.data.TreeRole
import com.mygentree.data.TreeRoleName
import org.springframework.data.jpa.repository.JpaRepository

interface TreeRoleRepository: JpaRepository<TreeRole, Long> {
    fun findByName(name: TreeRoleName): TreeRole
}