package com.mygentree.service

import com.google.gson.Gson
import com.mygentree.data.*
import com.mygentree.dto.*
import com.mygentree.dto.ConnectionType
import com.mygentree.dto.Gender
import com.mygentree.dto.request.DeleteTreeRequest
import com.mygentree.dto.request.TreeCreateRequest
import com.mygentree.dto.response.TreeInfo
import com.mygentree.repository.AccessStatusRepository
import com.mygentree.repository.AppRoleRepository
import com.mygentree.repository.TreeRepository
import com.mygentree.repository.TreeRoleRepository
import com.mygentree.security.UserPrincipal
import jakarta.persistence.EntityManager
import jakarta.persistence.EntityNotFoundException
import org.hibernate.SessionFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class TreeServiceImp(
    @Autowired
    private val treeRepository: TreeRepository,
    @Autowired
    private val entityManager: EntityManager,
    @Autowired
    val sessionFactory: SessionFactory,
    @Autowired
    val treeRoleRepository: TreeRoleRepository,
    @Autowired
    val accessStatusRepository: AccessStatusRepository,

    @Value("\${file.photoServerUrl}")
    val photoFileServerUrl: String,

    @Value("\${file.docServerUrl}")
    val docFileServerUrl: String
) : ITreeService {

    override fun getTreeByIdAndUserId(treeId: Long, userId: Long): GenTree {
        entityManager.clear()
        val result =
            treeRepository.findTree(treeId, userId).orElseThrow { EntityNotFoundException("Tree not found") }
        return mapToGenTree(result)
    }

    override fun createTree(rq: TreeCreateRequest, userId: Long): GenTree {
        val userPrincipal = SecurityContextHolder.getContext().authentication.principal as UserPrincipal
        val role = treeRoleRepository.findByName(TreeRoleName.ROLE_ADMIN)
        val accessStatus = accessStatusRepository.findByStatus(AccessStatusValue.GRANTED)
        val tree = Tree(
            id = null,
            name = rq.treeName,
            extraInfo = rq.extraInfo,
            persons = null,
            roles = null
        )
        sessionFactory.openSession().use {
            it.transaction.begin()
            it.persist(tree)
            it.transaction.commit()
            it.transaction.begin()
            val relId = treeRepository.persistUserTreeRel(userPrincipal.id, tree.id)
            treeRepository.persistUserTreeRoleRel(
                userTreesId = relId,
                roleId = role.id,
                accessStatusId = accessStatus.id,
                updatedBy = userPrincipal.id!!
            )
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
                    from relations
                    where person_id in 
                        (select persons.id from persons join tree on persons.tree_id = tree.id where user_id = :USERID and tree_id = :TREEID)
                    or related_person_id  in 
                        (select person.id from person join tree on person.tree_id = tree.id where user_id = :USERID and tree_id = :TREEID)
            """.trimIndent()
            )
                .setParameter("TREEID", rq.treeId.toLong())
                .setParameter("USERID", userId)
                .executeUpdate()

            it.createNativeMutationQuery(
                """
               delete
                    from persons
                        where persons.id in 
                           (select persons.id from persons join tree on persons.tree_id = tree.id where user_id = :USERID and tree_id = :TREEID)
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
        return treeRepository.findAllUserTrees(id).map {
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
            extraInfo = tree.extraInfo
        )
    }

    private fun mapRelatives(tree: Tree): MutableList<GenTreeNode> {
        val result = mutableListOf<GenTreeNode>()
        tree.persons?.forEach { person ->
            val relMap: Map<String?, List<Relation>>? = person.relations?.distinct()?.groupBy {
                it.relationType?.relationType?.name
            }?.toMap()
            result.add(
                GenTreeNode(
                    id = person.id.toString(),
                    gender = Gender.valueOf(person.gender?.gender.toString()),
                    parents = mapConnectionNode(relMap?.getOrDefault(RelationTypeValue.PARENT.name, mutableListOf())),
                    siblings = mapConnectionNode(relMap?.getOrDefault(RelationTypeValue.SIBLING.name, mutableListOf())),
                    spouses = mapConnectionNode(relMap?.getOrDefault(RelationTypeValue.SPOUSE.name, mutableListOf())),
                    children = mapConnectionNode(relMap?.getOrDefault(RelationTypeValue.CHILD.name, mutableListOf())),
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
        val node = Gson().fromJson(extraInfo, PersonInfoNode::class.java)
        val avatar = node.photoNames?.firstOrNull()?.let {
            photoFileServerUrl + it
        }
        return InfoNode(
            avatar = avatar,
            firstName = node.firstName,
            middleName = node.middleName,
            lastName = node.lastName,
            birthDate = node.birthDate,
            occupation = node.occupation,
            location = node.location,
            description = node.description,
            personDocuments = node.personDocuments?.map { PersonDocuments(
                url = it
            ) },
            photo = node.photoNames?.map { PersonPhoto(
                url = photoFileServerUrl + it,
                filename = it
            )}
        )
    }

    private fun mapConnectionNode(relations: List<Relation>?): MutableList<ConnectionNode>? {
        val result = mutableListOf<ConnectionNode>()
        relations?.forEach {
            result.add(
                ConnectionNode(
                    id = it.relatedPerson?.id.toString(),
                    type = ConnectionType.valueOf(it.connectionType?.connectionType.toString())
                )
            )
        }
        return result
    }

}