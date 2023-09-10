package com.mygentree.service

import com.mygentree.data.Tree
import com.mygentree.repository.TreeRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException
import org.springframework.stereotype.Service
import java.util.*

@Service
class TreeServiceImp(
    @Autowired
    private val treeRepository: TreeRepository
) : ITreeService {

    @Suppress("UNREACHABLE_CODE")
    override fun getTreeById(id: Long): Tree? {
        return treeRepository.findById(id).orElseThrow{EntityNotFoundException("Customer not found")}
    }

}