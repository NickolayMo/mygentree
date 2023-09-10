package com.mygentree.data

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id

@Entity
class Tree(
    var name: String,
    @Id @GeneratedValue var id: Long? = null)