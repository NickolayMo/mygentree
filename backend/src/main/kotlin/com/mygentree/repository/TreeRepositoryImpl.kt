package com.mygentree.repository

import com.google.gson.Gson
import com.mygentree.business.dto.ConnectionNode
import com.mygentree.business.dto.ConnectionType
import com.mygentree.business.dto.GenTree
import com.mygentree.business.dto.InfoNode
import com.mygentree.business.service.UpdateConnectionContext
import com.mygentree.business.service.UpdatePersonContext
import com.mygentree.presentation.web.controller.api.v1.mock
import org.springframework.stereotype.Component

@Component
class MockTreeRepositoryImpl : ITreeRepository {

    private val mockTree = Gson().fromJson(mock, GenTree::class.java)
    override fun getById(id: String): GenTree {
        return mockTree
    }

    override fun updatePerson(updatePersonContext: UpdatePersonContext): GenTree? =
        when (updatePersonContext.action) {
            UpdatePersonContext.UpdatePersonContextAction.DELETE -> {
                mockTree.relatives.removeAll { n -> n.id == updatePersonContext.nodeId }
                mockTree.relatives.forEach { rn->rn.children?.removeAll{ ch -> ch.id == updatePersonContext.nodeId} }
                mockTree.relatives.forEach { rn->rn.parents?.removeAll{ ch -> ch.id == updatePersonContext.nodeId} }
                mockTree.relatives.forEach { rn->rn.siblings?.removeAll{ ch -> ch.id == updatePersonContext.nodeId} }
                mockTree.relatives.forEach { rn->rn.spouses?.removeAll{ ch -> ch.id == updatePersonContext.nodeId} }
                mockTree
            }

            UpdatePersonContext.UpdatePersonContextAction.CREATE -> {
                mockTree
            }

            UpdatePersonContext.UpdatePersonContextAction.UPDATE -> {
                val node = mockTree.relatives.firstOrNull { n -> n.id == updatePersonContext.nodeId }
                var infoNode = node?.infoNode
                if(infoNode == null) {
                    infoNode = InfoNode()
                }
                infoNode.avatar = updatePersonContext.updateTreeContextData.avatar
                infoNode.firstName = updatePersonContext.updateTreeContextData.firstName
                infoNode.middleName = updatePersonContext.updateTreeContextData.middleName
                infoNode.lastName = updatePersonContext.updateTreeContextData.lastName
                infoNode.birthDate = updatePersonContext.updateTreeContextData.birthDate
                infoNode.occupation = updatePersonContext.updateTreeContextData.occupation
                node?.infoNode = infoNode
                mockTree
            }

        }

    override fun updateConnection(updateConnectionContext: UpdateConnectionContext): GenTree? {
        val node = mockTree.relatives.firstOrNull { n -> n.id == updateConnectionContext.nodeId }

        when (updateConnectionContext.action) {
            UpdateConnectionContext.TreeUpdateConnectionAction.DELETE -> {
                when(updateConnectionContext.context.connection) {
                    UpdateConnectionContext.TreeUpdateConnectionTarget.PARENTS ->{
                        node?.parents?.removeAll { it.id == updateConnectionContext.context.personNodeId }
                        return mockTree
                    }
                    UpdateConnectionContext.TreeUpdateConnectionTarget.CHILDREN ->{
                        node?.children?.removeAll { it.id == updateConnectionContext.context.personNodeId }
                        return mockTree
                    }
                    UpdateConnectionContext.TreeUpdateConnectionTarget.SPOUSES ->{
                        node?.spouses?.removeAll { it.id == updateConnectionContext.context.personNodeId }
                        return mockTree
                    }
                    UpdateConnectionContext.TreeUpdateConnectionTarget.SIBLINGS ->{
                        node?.siblings?.removeAll { it.id == updateConnectionContext.context.personNodeId }
                        return mockTree
                    }
                    else -> {
                        return mockTree
                    }
                }
            }

            UpdateConnectionContext.TreeUpdateConnectionAction.CREATE -> {
                when(updateConnectionContext.context.connection) {
                    UpdateConnectionContext.TreeUpdateConnectionTarget.PARENTS ->{
                        node?.parents?.add(ConnectionNode(
                            id = updateConnectionContext.context.personNodeId,
                            type = ConnectionType.valueOf(updateConnectionContext.context.connectionType.name)
                        ))
                        return mockTree
                    }
                    UpdateConnectionContext.TreeUpdateConnectionTarget.CHILDREN ->{
                        node?.children?.add(ConnectionNode(
                            id = updateConnectionContext.context.personNodeId,
                            type = ConnectionType.valueOf(updateConnectionContext.context.connectionType.name)
                        ))
                        return mockTree
                    }
                    UpdateConnectionContext.TreeUpdateConnectionTarget.SPOUSES ->{
                        node?.spouses?.add(ConnectionNode(
                            id = updateConnectionContext.context.personNodeId,
                            type = ConnectionType.valueOf(updateConnectionContext.context.connectionType.name)
                        ))
                        return mockTree
                    }
                    UpdateConnectionContext.TreeUpdateConnectionTarget.SIBLINGS ->{
                        node?.siblings?.add(ConnectionNode(
                            id = updateConnectionContext.context.personNodeId,
                            type = ConnectionType.valueOf(updateConnectionContext.context.connectionType.name)
                        ))
                        return mockTree
                    }
                    else -> {
                        return mockTree
                    }
                }
            }

            UpdateConnectionContext.TreeUpdateConnectionAction.UPDATE -> {
                when(updateConnectionContext.context.connection) {
                    UpdateConnectionContext.TreeUpdateConnectionTarget.PARENTS ->{
                        val connectionNode = node?.parents?.firstOrNull{it.id == updateConnectionContext.context.personNodeId}
                        connectionNode?.id = updateConnectionContext.context.personNodeId
                        connectionNode?.type = ConnectionType.valueOf(updateConnectionContext.context.connectionType.name)
                        return mockTree
                    }
                    UpdateConnectionContext.TreeUpdateConnectionTarget.CHILDREN ->{
                        val connectionNode = node?.children?.firstOrNull{it.id == updateConnectionContext.context.personNodeId}
                        connectionNode?.id = updateConnectionContext.context.personNodeId
                        connectionNode?.type = ConnectionType.valueOf(updateConnectionContext.context.connectionType.name)
                        return mockTree
                    }
                    UpdateConnectionContext.TreeUpdateConnectionTarget.SPOUSES ->{
                        val connectionNode = node?.spouses?.firstOrNull{it.id == updateConnectionContext.context.personNodeId}
                        connectionNode?.id = updateConnectionContext.context.personNodeId
                        connectionNode?.type = ConnectionType.valueOf(updateConnectionContext.context.connectionType.name)
                        return mockTree
                    }
                    UpdateConnectionContext.TreeUpdateConnectionTarget.SIBLINGS ->{
                        val connectionNode = node?.siblings?.firstOrNull{it.id == updateConnectionContext.context.personNodeId}
                        connectionNode?.id = updateConnectionContext.context.personNodeId
                        connectionNode?.type = ConnectionType.valueOf(updateConnectionContext.context.connectionType.name)
                        return mockTree
                    }
                    else -> {
                        return mockTree
                    }
                }
            }

        }
    }
}