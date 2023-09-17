package com.mygentree.service

import com.google.gson.Gson
import com.mygentree.business.dto.*
import com.mygentree.data.Relation
import com.mygentree.data.RelationType
import com.mygentree.data.Tree
import com.mygentree.repository.TreeRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class TreeServiceImp(
    @Autowired
    private val treeRepository: TreeRepository
) : ITreeService {

    @Suppress("UNREACHABLE_CODE")
    override fun getTreeById(id: Long): GenTree {
        val result = treeRepository.findById(id).orElseThrow{EntityNotFoundException("Tree not found")}
        return mapToGenTree(result)
    }
    fun mapToGenTree(tree: Tree): GenTree {
        return GenTree(
            relatives = mapRelatives(tree)
        )
    }

    private fun mapRelatives(tree: Tree): MutableList<GenTreeNode> {
        val result = mutableListOf<GenTreeNode>()
        tree.persons?.forEach{person ->
            val relMap: Map<String?, List<Relation>>? = person.relations?.distinct()?.groupBy {
                it.relationType
            }?.toMap()
            result.add(
                GenTreeNode(
                    id = person.id.toString(),
                    gender = Gender.valueOf(person.gender.toString()),
                    parents = mapConnectionNode(relMap?.getOrDefault(RelationType.PARENT.name, mutableListOf())),
                    siblings = mapConnectionNode(relMap?.getOrDefault(RelationType.SIBLING.name, mutableListOf())),
                    spouses = mapConnectionNode(relMap?.getOrDefault(RelationType.SPOUSE.name, mutableListOf())),
                    children = mapConnectionNode(relMap?.getOrDefault(RelationType.CHILD.name, mutableListOf())),
                    infoNode = mapInfoNode(person.extraInfo),
                    isMain = person.isMain
                )
            )
        }
        result.sortByDescending { it.isMain }
        return result
    }

    private fun mapInfoNode(extraInfo: String?): InfoNode? {
        return Gson().fromJson(extraInfo, InfoNode::class.java)
    }

    private fun mapConnectionNode(relations: List<Relation>?): MutableList<ConnectionNode>? {
        val result = mutableListOf<ConnectionNode>()
        relations?.forEach {
            result.add(
                ConnectionNode(
                    id = it.secondPerson?.id.toString(),
                    type = ConnectionType.valueOf(it.connectionType.toString())
                )
            )
        }
        return result
    }

}