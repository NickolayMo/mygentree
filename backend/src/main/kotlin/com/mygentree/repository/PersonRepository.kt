package com.mygentree.repository

import com.mygentree.data.Person
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface PersonRepository: JpaRepository<Person, Long> {
    fun findByIdAndTreeId(nodeId: Long, id: Long?): Optional<Person>
}