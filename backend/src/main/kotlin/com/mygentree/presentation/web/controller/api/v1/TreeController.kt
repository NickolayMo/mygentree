package com.mygentree.presentation.web.controller.api.v1

import com.mygentree.business.dto.GenTree
import com.mygentree.business.extensions.fromRequest
import com.mygentree.business.service.ITreeService
import com.mygentree.business.service.UpdateConnectionContext
import com.mygentree.business.service.UpdatePersonContext
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/web/api/v1/")
class TreeController(
    @Autowired
    private val treeService: ITreeService
) {
    @PostMapping("/tree/get")
    fun getTree(@RequestBody request: TreeRequest): TreeResponse? {
        val tree = treeService.getTreeById(request.treeId)
        return TreeResponse(success = true, data = tree, error = null)
    }
    @PostMapping("/tree/update/person")
    fun updatePerson(@RequestBody request: TreeUpdatePersonRequest): TreeResponse {
        val tree = treeService.updatePerson(UpdatePersonContext.fromRequest(request))
        return TreeResponse(success = true, data = tree, error = null)
    }
    @PostMapping("/tree/update/connections")
    fun updateConnections(@RequestBody request: TreeUpdateConnectionRequest): TreeResponse {
        val tree = treeService.updateConnection(UpdateConnectionContext.fromRequest(request))
        return TreeResponse(success = true, data = tree, error = null)
    }
}


data class TreeResponse(
    val success: Boolean,
    val data: GenTree?,
    val error: String?
)

data class TreeRequest(
    val userId: String,
    val treeId: String,
)

data class TreeUpdatePersonRequest(
    val userId: String,
    val treeId: String,
    val action: TreeAction,
    val nodeId: String,
    val context: TreeUpdateContext,
) {
    enum class TreeAction {
        UPDATE,
        DELETE,
        CREATE
    }

    data class TreeUpdateContext(
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


data class TreeUpdateConnectionRequest(
    val userId: String,
    val treeId: String,
    val nodeId: String,
    val action: TreeUpdateConnectionAction,
    val context: TreeUpdateConnectionContext,

) {
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
}