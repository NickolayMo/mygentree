package com.mygentree.service

import com.mygentree.dto.GenTree
import com.mygentree.dto.request.DeleteTreeRequest
import com.mygentree.dto.request.TreeCreateRequest
import com.mygentree.dto.response.TreeInfo

interface ITreeService {
    fun getUserTrees(id: Long?): List<TreeInfo>?
    fun getTreeByIdAndUserId(treeId: Long, userId: Long): GenTree

    fun createTree(rq: TreeCreateRequest, userId: Long): GenTree
    fun deleteTree(rq: DeleteTreeRequest, userId: Long): Boolean
}