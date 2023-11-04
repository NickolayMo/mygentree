package com.mygentree.dto.request

data class TreeUpdatePersonRequest(
    val userId: String,
    val treeId: String,
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
        var gender: String?
    )

    data class Connection(
        val id: String,
        val type: ConnectionType,
    )
    enum class ConnectionType {
        BLOOD,
        MARRIED,
        DIVORCED,
        ADOPTED,
        HALF
    }
}