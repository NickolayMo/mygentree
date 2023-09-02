package com.mygentree.presentation.web.controller.api.v1

import com.mygentree.business.dto.GenTree
import com.mygentree.business.dto.GenTreeNode
import com.mygentree.business.extensions.fromRequest
import com.mygentree.business.service.ITreeService
import com.mygentree.business.service.TreeUpdatePerson
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
    //create, delete, update
    @PostMapping("/tree/person/update")
    fun updatePerson(@RequestBody request: TreeUpdatePersonRequest): TreeResponse {
        val tree = treeService.updatePerson(TreeUpdatePerson.fromRequest(request))
        return TreeResponse(success = true, data = tree, error = null)
    }
    @PostMapping("/tree/person/getlist")
    fun personGetList(@RequestBody request: TreeRequest): PersonGetListResponse? {
        val data = treeService.getPersonList(request.treeId)
        return PersonGetListResponse(success = true, data = data, error = null)
    }
}

data class PersonGetListResponse(
    val success: Boolean,
    val data: List<GenTreeNode>?,
    val error: String?
)


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
        var spouses: List<Connection>?
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