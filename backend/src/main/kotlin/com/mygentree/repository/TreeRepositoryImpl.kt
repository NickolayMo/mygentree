package com.mygentree.repository

import com.google.gson.Gson
import com.mygentree.business.dto.*
import com.mygentree.business.service.TreeUpdatePerson
import com.mygentree.data.Tree
import com.mygentree.presentation.web.controller.api.v1.mock
import org.springframework.stereotype.Component
import java.security.MessageDigest
import kotlin.random.Random

@Component
class TreeRepositoryImpl : ITreeRepository {

    private val mockTree = Gson().fromJson(mock, GenTree::class.java)
    override fun getById(id: String): GenTree {
        return mockTree
    }

    override fun updatePerson(updatePersonContext: TreeUpdatePerson): GenTree? =
        when (updatePersonContext.action) {

            TreeUpdatePerson.TreeAction.DELETE -> {
                mockTree.relatives.removeAll { n -> n.id == updatePersonContext.context.nodeId }
                mockTree.relatives.forEach { rn->rn.children?.removeAll{ ch -> ch.id == updatePersonContext.context.nodeId} }
                mockTree.relatives.forEach { rn->rn.parents?.removeAll{ ch -> ch.id == updatePersonContext.context.nodeId} }
                mockTree.relatives.forEach { rn->rn.siblings?.removeAll{ ch -> ch.id == updatePersonContext.context.nodeId} }
                mockTree.relatives.forEach { rn->rn.spouses?.removeAll{ ch -> ch.id == updatePersonContext.context.nodeId} }
                mockTree
            }

            TreeUpdatePerson.TreeAction.CREATE -> {
                val node = GenTreeNode(
                    id = MessageDigest.getInstance("MD5").digest(Random(1).nextInt().toString().toByteArray()).toString(),
                    gender = Gender.FEMALE,
                    parents = mutableListOf(),
                    siblings = mutableListOf(),
                    spouses = mutableListOf(),
                    children = mutableListOf(),
                    infoNode = null
                )
                
                var infoNode = node?.infoNode
                if(infoNode == null) {
                    infoNode = InfoNode()
                }
                infoNode.avatar = updatePersonContext.context.avatar
                infoNode.firstName = updatePersonContext.context.firstName
                infoNode.middleName = updatePersonContext.context.middleName
                infoNode.lastName = updatePersonContext.context.lastName
                infoNode.birthDate = updatePersonContext.context.birthDate
                infoNode.occupation = updatePersonContext.context.occupation
                node?.infoNode = infoNode


                node?.parents = updatePersonContext.context.parents?.map { ConnectionNode(id = it.personId, type = ConnectionType.valueOf(it.connectionType.name)) }?.toMutableList() ?: mutableListOf()
                node?.children = updatePersonContext.context.children?.map { ConnectionNode(id = it.personId, type = ConnectionType.valueOf(it.connectionType.name)) }?.toMutableList()?: mutableListOf()
                node?.spouses = updatePersonContext.context.children?.map { ConnectionNode(id = it.personId, type = ConnectionType.valueOf(it.connectionType.name)) }?.toMutableList()?: mutableListOf()
                node?.siblings = updatePersonContext.context.siblings?.map { ConnectionNode(id = it.personId, type = ConnectionType.valueOf(it.connectionType.name)) }?.toMutableList()?: mutableListOf()
                node.parents?.forEach { p->
                    mockTree.relatives.find { it.id == p.id}?.children?.add(ConnectionNode(id = node.id, type =ConnectionType.BLOOD))
                }

                mockTree.relatives.add(node)
                mockTree
            }

            TreeUpdatePerson.TreeAction.UPDATE -> {
                val node = mockTree.relatives.firstOrNull { n -> n.id == updatePersonContext.context.nodeId }
                var infoNode = node?.infoNode
                if(infoNode == null) {
                    infoNode = InfoNode()
                }
                infoNode.avatar = updatePersonContext.context.avatar
                infoNode.firstName = updatePersonContext.context.firstName
                infoNode.middleName = updatePersonContext.context.middleName
                infoNode.lastName = updatePersonContext.context.lastName
                infoNode.birthDate = updatePersonContext.context.birthDate
                infoNode.occupation = updatePersonContext.context.occupation
                node?.infoNode = infoNode

                node?.parents = updatePersonContext.context.parents?.map { ConnectionNode(id = it.personId, type = ConnectionType.valueOf(it.connectionType.name)) }?.toMutableList()
                node?.children = updatePersonContext.context.children?.map { ConnectionNode(id = it.personId, type = ConnectionType.valueOf(it.connectionType.name)) }?.toMutableList()
                node?.spouses = updatePersonContext.context.children?.map { ConnectionNode(id = it.personId, type = ConnectionType.valueOf(it.connectionType.name)) }?.toMutableList()
                node?.siblings = updatePersonContext.context.siblings?.map { ConnectionNode(id = it.personId, type = ConnectionType.valueOf(it.connectionType.name)) }?.toMutableList()
                mockTree
            }


        }

    override fun getPersonList(treeId: String): List<GenTreeNode>? {
        return mockTree.relatives.toList()
    }
}