package com.mygentree.business.service

data class UpdateConnectionContext(
    val userId: String,
    val treeId: String,
    val nodeId: String,
    val action: TreeUpdateConnectionAction,
    val context: TreeUpdateConnectionContext,
){
    enum class TreeUpdateConnectionAction {
        UPDATE,
        DELETE,
        CREATE
    }

    data class TreeUpdateConnectionContext(
        val personNodeId: String,
        val connectionType: TreeUpdateConnectionType,
        val connection: TreeUpdateConnectionTarget
    )

    enum class TreeUpdateConnectionTarget {
        PARENTS,
        SIBLINGS,
        SPOUSES,
        CHILDREN
    }

    enum class TreeUpdateConnectionType {
        BLOOD,
        MARRIED
    }

    companion object
}