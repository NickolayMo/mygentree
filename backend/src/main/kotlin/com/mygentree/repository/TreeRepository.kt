package com.mygentree.repository

import com.mygentree.data.Tree
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface TreeRepository: JpaRepository<Tree, Long> {
    fun findAllByUserId(userId: Long?): MutableList<Tree>
    fun findByIdAndUserId(treeId:Long?, userId: Long?): Optional<Tree>
}