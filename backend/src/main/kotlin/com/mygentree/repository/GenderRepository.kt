package com.mygentree.repository

import com.mygentree.data.Gender
import com.mygentree.data.GenderTypeValue
import com.mygentree.data.Tree
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface GenderRepository : JpaRepository<Gender, Long> {

    fun findByGender(gender: GenderTypeValue): Gender

}