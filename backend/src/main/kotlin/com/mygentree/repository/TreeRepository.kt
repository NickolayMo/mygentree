package com.mygentree.repository

import com.mygentree.data.Tree
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TreeRepository: JpaRepository<Tree, Long> {
}