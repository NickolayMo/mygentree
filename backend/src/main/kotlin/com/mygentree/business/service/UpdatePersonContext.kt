package com.mygentree.business.service

data class UpdatePersonContext(
    val userId: String?,
    val treeId: String?,
    val nodeId: String?,
    val action: UpdatePersonContextAction,
    val updateTreeContextData: UpdatePersonContextData

) {
    enum class UpdatePersonContextAction {
        UPDATE,
        DELETE,
        CREATE
    }

    data class UpdatePersonContextData(
        var avatar: String?,
        var firstName: String?,
        var middleName: String?,
        var lastName: String?,
        var birthDate: String?,
        var occupation: String?,
        var location: String?,
    )

    companion object
}
