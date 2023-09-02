package com.mygentree.business.service

import com.mygentree.business.dto.GenTree
import com.mygentree.business.dto.GenTreeNode

interface ITreeService {
    fun getTreeById(id: String): GenTree?
    fun updatePerson(updatePeronContext: TreeUpdatePerson): GenTree?
    fun getPersonList(treeId: String): List<GenTreeNode>?
}