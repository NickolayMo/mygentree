package com.mygentree.controller

import com.mygentree.dto.GenTree
import com.mygentree.dto.TreeUpdatePerson
import com.mygentree.dto.request.TreeRequest
import com.mygentree.dto.request.TreeUpdatePersonRequest
import com.mygentree.dto.response.ApiResponse
import com.mygentree.extensions.fromRequest
import com.mygentree.security.CurrentUser
import com.mygentree.security.UserPrincipal
import com.mygentree.service.IPersonService
import com.mygentree.service.ITreeService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/person")
class PersonController(
    @Autowired
    private val personService: IPersonService,
    @Autowired
    private val treeService: ITreeService,
) {
    @PostMapping("/update")
    @PreAuthorize("hasRole('USER')")
    fun updatePerson(
        @RequestBody request: TreeUpdatePersonRequest,
        @CurrentUser user: UserPrincipal
    ): ResponseEntity<ApiResponse<GenTree>> {
        personService.updatePerson(TreeUpdatePerson.fromRequest(request, user.id!!))
        val tree = treeService.getTreeByIdAndUserId(request.treeId.toLong(), user.id!!)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                data = tree,
                error = null
            )
        )
    }

    @PostMapping("/get/list")
    @PreAuthorize("hasRole('USER')")
    fun personGetList(
        @RequestBody request: TreeRequest,
        @CurrentUser user: UserPrincipal
    ): ResponseEntity<ApiResponse<GenTree>> {
        val tree = treeService.getTreeByIdAndUserId(request.treeId.toLong(), user.id!!)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                data = tree,
                error = null
            )
        )
    }

}