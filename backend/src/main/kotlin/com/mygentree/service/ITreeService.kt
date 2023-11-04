package com.mygentree.service

import com.mygentree.dto.GenTree

interface ITreeService {
    fun getUserTrees(id: Long?): List<Long>?
    fun getTreeByIdAndUserId(treeId: Long, userId: Long): GenTree
}