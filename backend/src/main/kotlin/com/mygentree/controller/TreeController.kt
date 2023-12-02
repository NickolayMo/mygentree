package com.mygentree.controller

import com.mygentree.dto.GenTree
import com.mygentree.dto.request.DeleteTreeRequest
import com.mygentree.dto.request.TreeCreateRequest
import com.mygentree.dto.request.TreeRequest
import com.mygentree.dto.response.ApiResponse
import com.mygentree.dto.response.TreeInfo
import com.mygentree.security.CurrentUser
import com.mygentree.security.UserPrincipal
import com.mygentree.service.ITreeService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/tree")
class TreeController(
    @Autowired
    private val treeService: ITreeService,
) {
    @PostMapping("/get")
    @PreAuthorize("hasRole('USER')")
    fun getTree(
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



    @GetMapping("get/list")
    @PreAuthorize("hasRole('USER')")
    fun getTreeList(@CurrentUser user: UserPrincipal): ResponseEntity<ApiResponse<List<TreeInfo>>> {
        val treeList = treeService.getUserTrees(user.id)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                data = treeList,
                error = null
            )
        )
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('USER')")
    fun createTree(@RequestBody rq: TreeCreateRequest,
                   @CurrentUser user: UserPrincipal): ResponseEntity<ApiResponse<GenTree>> {
        val tree = treeService.createTree(rq, user.id!!)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                data = tree,
                error = null
            )
        )
    }

    @PostMapping("/delete")
    @PreAuthorize("hasRole('USER')")
    fun deleteTree(@RequestBody rq: DeleteTreeRequest,
                   @CurrentUser user: UserPrincipal):  ResponseEntity<ApiResponse<List<TreeInfo>>> {
        treeService.deleteTree(rq, user.id!!)
        val treeList = treeService.getUserTrees(user.id)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                data = treeList,
                error = null
            )
        )
    }

}