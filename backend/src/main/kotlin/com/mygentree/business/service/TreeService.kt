package com.mygentree.business.service

import com.mygentree.business.dto.GenTree
import com.mygentree.business.dto.GenTreeNode
import com.mygentree.repository.ITreeRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class TreeService(
    private val repository: ITreeRepository
) : ITreeService {

    override fun getTreeById(id: String): GenTree? {
        return repository.getById(id)
    }

    override fun updatePerson(updatePeronContext: TreeUpdatePerson): GenTree? {
        return repository.updatePerson(updatePeronContext)
    }

    override fun getPersonList(treeId: String): List<GenTreeNode>? {
        return repository.getPersonList(treeId)
    }
}