package com.mygentree.repository

import com.mygentree.data.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface ConnectionTypeRepository : JpaRepository<ConnectionType, Long> {

    fun findByConnectionType(connectionType: ConnectionTypeValue): ConnectionType

}