package com.mygentree.service

import com.google.gson.Gson
import com.mygentree.data.Person
import com.mygentree.data.Relation
import com.mygentree.data.RelationType
import com.mygentree.data.Tree
import com.mygentree.dto.*
import com.mygentree.dto.request.DeleteTreeRequest
import com.mygentree.dto.request.TreeCreateRequest
import com.mygentree.dto.response.TreeInfo
import com.mygentree.repository.TreeRepository
import jakarta.persistence.EntityManager
import jakarta.persistence.EntityNotFoundException
import org.hibernate.SessionFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class TreeServiceImp(
    @Autowired
    private val treeRepository: TreeRepository,
    @Autowired
    private val entityManager: EntityManager,
    @Autowired
    val sessionFactory: SessionFactory
) : ITreeService {

    override fun getTreeByIdAndUserId(treeId: Long, userId: Long): GenTree {
        entityManager.clear()
        val result =
            treeRepository.findByIdAndUserId(treeId, userId).orElseThrow { EntityNotFoundException("Tree not found") }
        return mapToGenTree(result)
    }

    override fun createTree(rq: TreeCreateRequest, userId: Long): GenTree {
        val tree = Tree(
            id = null,
            name = rq.treeName,
            extraInfo = rq.extraInfo,
            userId = userId,
            persons = null
        )
        sessionFactory.openSession().use {
            it.transaction.begin()
            it.persist(tree)
            it.transaction.commit()
        }
        return mapToGenTree(tree)
    }

    override fun deleteTree(rq: DeleteTreeRequest, userId: Long): Boolean {
        sessionFactory.openSession().use {
            it.transaction.begin()
            it.createNativeMutationQuery(
                """
                delete
                    from relation
                    where first_person_id in 
                        (select person.id from person join tree on person.tree_id = tree.id where user_id = :USERID and tree_id = :TREEID)
                    or second_person_id  in 
                        (select person.id from person join tree on person.tree_id = tree.id where user_id = :USERID and tree_id = :TREEID)
            """.trimIndent()
            )
                .setParameter("TREEID", rq.treeId.toLong())
                .setParameter("USERID", userId)
                .executeUpdate()

            it.createNativeMutationQuery(
                """
               delete
                    from person
                        where person.id in 
                           (select person.id from person join tree on person.tree_id = tree.id where user_id = :USERID and tree_id = :TREEID)
            """.trimIndent()
            )
                .setParameter("TREEID", rq.treeId.toLong())
                .setParameter("USERID", userId)
                .executeUpdate()


            it.createNativeMutationQuery(
                """
               delete
                    from tree
                       where user_id = :USERID
                       and id = :TREEID
            """.trimIndent()
            )
                .setParameter("TREEID", rq.treeId.toLong())
                .setParameter("USERID", userId)
                .executeUpdate()
            it.transaction.commit()
        }
        return true
    }

    override fun getUserTrees(id: Long?): List<TreeInfo>? {
        treeRepository.findAll()
        return treeRepository.findAllByUserId(id).map {
            TreeInfo(
                id = it.id,
                name = it.name,
                extraInfo = it.extraInfo
            )
        }.toList()

    }

    fun mapToGenTree(tree: Tree): GenTree {
        return GenTree(
            relatives = mapRelatives(tree),
            treeId = tree.id,
            userId = tree.userId,
            extraInfo = tree.extraInfo
        )
    }

    private fun mapRelatives(tree: Tree): MutableList<GenTreeNode> {
        val result = mutableListOf<GenTreeNode>()
        tree.persons?.forEach { person ->
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
                    isMain = person.isMain,
                    kinship = calcKinship(person)
                )
            )
        }
        result.sortByDescending { it.isMain }
        return result
    }

    private fun calcKinship(person: Person): String? {
        return "Родственник"
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