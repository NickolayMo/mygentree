package com.mygentree.repository

import com.mygentree.data.Relation
import org.springframework.data.jpa.repository.JpaRepository

interface RelationRepository: JpaRepository<Relation, Long>