package com.mygentree.repository

import com.mygentree.business.dto.GenTree
import com.mygentree.business.dto.GenTreeNode
import com.mygentree.business.service.UpdateConnectionContext
import com.mygentree.business.service.TreeUpdatePerson

interface ITreeRepository {
    fun getById(id: String): GenTree
    fun updatePerson(updatePersonContext: TreeUpdatePerson): GenTree?
    //fun updateConnection(updateConnectionContext: UpdateConnectionContext): GenTree?
    fun getPersonList(treeId: String): List<GenTreeNode>?
}