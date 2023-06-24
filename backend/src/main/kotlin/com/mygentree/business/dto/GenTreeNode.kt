package com.mygentree.business.dto

data class GenTreeNode(
    var id: String,
    var gender: Gender?,
    var parents: MutableList<ConnectionNode>?,
    var siblings: MutableList<ConnectionNode>?,
    var spouses: MutableList<ConnectionNode>?,
    var children: MutableList<ConnectionNode>?,
    var infoNode: InfoNode?,
)