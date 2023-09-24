package com.mygentree.repository

import com.mygentree.dto.GenTree
import com.mygentree.dto.GenTreeNode
import com.mygentree.dto.TreeUpdatePerson

interface MockITreeRepository {
    fun getById(id: String): GenTree
    fun updatePerson(updatePersonContext: TreeUpdatePerson): GenTree?
    fun getPersonList(treeId: String): List<GenTreeNode>?
}