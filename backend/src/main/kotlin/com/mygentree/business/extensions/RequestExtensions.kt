package com.mygentree.business.extensions

import com.mygentree.business.service.UpdateConnectionContext
import com.mygentree.business.service.UpdatePersonContext
import com.mygentree.presentation.web.controller.api.v1.TreeUpdateConnectionRequest
import com.mygentree.presentation.web.controller.api.v1.TreeUpdatePersonRequest

fun UpdateConnectionContext.Companion.fromRequest(request: TreeUpdateConnectionRequest): UpdateConnectionContext {
    return UpdateConnectionContext(
        userId = request.userId,
        treeId = request.treeId,
        nodeId = request.nodeId,
        action = UpdateConnectionContext.TreeUpdateConnectionAction.valueOf(request.action.name),
        context = UpdateConnectionContext.TreeUpdateConnectionContext(
            personNodeId = request.context.personNodeId,
            connectionType = UpdateConnectionContext.TreeUpdateConnectionType.valueOf(request.context.connectionType.name),
            connection = UpdateConnectionContext.TreeUpdateConnectionTarget.valueOf(request.context.connection.name)
        )
    )
}
fun UpdatePersonContext.Companion.fromRequest(request: TreeUpdatePersonRequest): UpdatePersonContext {
    return UpdatePersonContext(
        userId = request.userId,
        treeId = request.treeId,
        nodeId = request.nodeId,
        action = UpdatePersonContext.UpdatePersonContextAction.valueOf(request.action.name),
        updateTreeContextData = UpdatePersonContext.UpdatePersonContextData(
            avatar = request.context.avatar,
            firstName = request.context.firstName,
            middleName = request.context.middleName,
            lastName = request.context.lastName,
            birthDate = request.context.birthDate,
            occupation = request.context.occupation,
            location = request.context.location
        )
    )
}