package com.mygentree.controller

import com.mygentree.dto.GenTree
import com.mygentree.dto.GenTreeNode
import com.mygentree.extensions.fromRequest

import com.mygentree.dto.TreeUpdatePerson
import com.mygentree.service.IPersonService
import com.mygentree.service.ITreeService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/web/api/v1/")
class TreeController(
    @Autowired
    private val treeService: ITreeService,
    private val personService: IPersonService
) {
    @PostMapping("/tree/get")
    fun getTree(@RequestBody request: TreeRequest): TreeResponse? {
        val tree = treeService.getTreeById(request.treeId.toLong())
        return TreeResponse(success = true, data = tree, error = null)
    }
    //create, delete, update
    @PostMapping("/tree/person/update")
    fun updatePerson(@RequestBody request: TreeUpdatePersonRequest): TreeResponse {
        personService.updatePerson(TreeUpdatePerson.fromRequest(request))
        val tree = treeService.getTreeById(request.treeId.toLong())
        return TreeResponse(success = true, data = tree, error = null)
    }
    @PostMapping("/tree/person/getlist")
    fun personGetList(@RequestBody request: TreeRequest): PersonGetListResponse? {
        val tree = treeService.getTreeById(request.treeId.toLong())
        return PersonGetListResponse(success = true, data = tree.relatives, error = null)
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