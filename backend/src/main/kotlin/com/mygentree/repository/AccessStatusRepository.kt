package com.mygentree.repository

import com.mygentree.data.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AccessStatusRepository : JpaRepository<AccessStatus, Long> {

    fun findByStatus(status: AccessStatusValue): AccessStatus

}