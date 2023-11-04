package com.mygentree.service

import com.mygentree.dto.GenTree
import com.mygentree.dto.response.TreeInfo

interface ITreeService {
    fun getUserTrees(id: Long?): List<TreeInfo>?
    fun getTreeByIdAndUserId(treeId: Long, userId: Long): GenTree
}