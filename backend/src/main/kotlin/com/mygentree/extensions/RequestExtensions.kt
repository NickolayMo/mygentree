package com.mygentree.extensions

import com.mygentree.dto.TreeUpdatePerson
import com.mygentree.dto.request.TreeUpdatePersonRequest

fun TreeUpdatePerson.Companion.fromRequest(request: TreeUpdatePersonRequest, userId: Long): TreeUpdatePerson {
    return TreeUpdatePerson(
        treeId = request.treeId,
        action = TreeUpdatePerson.TreeAction.valueOf(request.action.name),
        userId = userId,
        context = TreeUpdatePerson.TreeUpdatePersonContext(
            avatar = request.context.avatar,
            firstName = request.context.firstName,
            middleName = request.context.middleName,
            lastName = request.context.lastName,
            birthDate = request.context.birthDate,
            occupation = request.context.occupation,
            location = request.context.location,
            nodeId = request.context.nodeId,
            parents = request.context.parents?.map {
                mapConnection(it)
            },
            children = request.context.children?.map {
                mapConnection(it)
            },
            siblings = request.context.siblings?.map {
                mapConnection(it)
            },
            spouses = request.context.spouses?.map {
                mapConnection(it)
            },
            gender = request.context.gender,
            photoNames = request.context.photoNames

            )
    )
}

private fun mapConnection(it: TreeUpdatePersonRequest.Connection) =
    TreeUpdatePerson.Connection(
        personId = it.id,
        connectionType = TreeUpdatePerson.ConnectionType.valueOf(it.type.name)
    )