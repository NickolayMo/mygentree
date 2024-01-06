package com.mygentree.dto

data class TreeUpdatePerson(
    val treeId: String,
    val userId: Long,
    val action: TreeAction,
    val context: TreeUpdatePersonContext,
) {
    enum class TreeAction {
        UPDATE,
        DELETE,
        CREATE
    }

    data class TreeUpdatePersonContext(
        var nodeId: String?,
        var avatar: String?,
        var firstName: String?,
        var middleName: String?,
        var lastName: String?,
        var birthDate: String?,
        var occupation: String?,
        var location: String?,
        var parents: List<Connection>?,
        var children: List<Connection>?,
        var siblings: List<Connection>?,
        var spouses: List<Connection>?,
        var gender: String?,
        var photoNames: List<String>? = null
    )

    data class Connection(
        val personId: String,
        val connectionType: ConnectionType,
    )
    enum class ConnectionType {
        BLOOD,
        MARRIED
    }
    companion object
}