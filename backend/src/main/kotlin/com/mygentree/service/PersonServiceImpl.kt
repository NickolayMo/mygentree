package com.mygentree.service

import com.google.gson.Gson
import com.mygentree.data.Person
import com.mygentree.data.Relation
import com.mygentree.data.RelationType
import com.mygentree.data.Tree
import com.mygentree.dto.GenTree
import com.mygentree.dto.InfoNode
import com.mygentree.dto.TreeUpdatePerson
import com.mygentree.repository.PersonRepository
import com.mygentree.repository.TreeRepository
import jakarta.persistence.EntityManager
import jakarta.persistence.EntityNotFoundException
import jakarta.persistence.PersistenceContext
import org.hibernate.SessionFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PersonServiceImpl(
    @Autowired
    val personRepository: PersonRepository,
    @Autowired
    val treeRepository: TreeRepository,

    @PersistenceContext
    val entityManager: EntityManager,
    @Autowired
    val sessionFactory: SessionFactory
) : IPersonService {
    override fun updatePerson(updatePersonContext: TreeUpdatePerson): GenTree? {
        when (updatePersonContext.action) {

            TreeUpdatePerson.TreeAction.DELETE -> {
                delete(updatePersonContext)
            }

            TreeUpdatePerson.TreeAction.CREATE -> {
                create(updatePersonContext)
            }

            TreeUpdatePerson.TreeAction.UPDATE -> {
                update(updatePersonContext)
            }
        }
        return null
    }

    @Transactional
    private fun update(updatePersonContext: TreeUpdatePerson) {
        val nodeId = updatePersonContext.context.nodeId?.toLongOrNull() ?: throw Exception("Wrong node id")
        val node = personRepository.findById(nodeId).orElseThrow { EntityNotFoundException("Entity not found") }
        var infoNode = InfoNode()
        val extraInfo = node.extraInfo
        if (extraInfo != null) {
            infoNode = Gson().fromJson(extraInfo, InfoNode::class.java)
        }
        infoNode.avatar = updatePersonContext.context.avatar
        infoNode.firstName = updatePersonContext.context.firstName
        infoNode.middleName = updatePersonContext.context.middleName
        infoNode.lastName = updatePersonContext.context.lastName
        infoNode.birthDate = updatePersonContext.context.birthDate
        infoNode.occupation = updatePersonContext.context.occupation
        node?.extraInfo = Gson().toJson(infoNode)
        personRepository.save(node)

//        node?.parents = updatePersonContext.context.parents?.map {
//            ConnectionNode(
//                id = it.personId,
//                type = ConnectionType.valueOf(it.connectionType.name)
//            )
//        }?.toMutableList()
//        node?.children = updatePersonContext.context.children?.map {
//            ConnectionNode(
//                id = it.personId,
//                type = ConnectionType.valueOf(it.connectionType.name)
//            )
//        }?.toMutableList()
//        node?.spouses = updatePersonContext.context.children?.map {
//            ConnectionNode(
//                id = it.personId,
//                type = ConnectionType.valueOf(it.connectionType.name)
//            )
//        }?.toMutableList()
//        node?.siblings = updatePersonContext.context.siblings?.map {
//            ConnectionNode(
//                id = it.personId,
//                type = ConnectionType.valueOf(it.connectionType.name)
//            )
//        }?.toMutableList()
//        mockTree
    }


    private fun create(updatePersonContext: TreeUpdatePerson) {
        val tree = treeRepository.findById(updatePersonContext.treeId.toLong()).orElseThrow()
        val node = Person(
            id = null,
            relations = setOf(),
            tree = tree,
            extraInfo = null,
            gender = updatePersonContext.context.gender,
            isMain = false
        )

        val infoNode = InfoNode()
        infoNode.avatar = updatePersonContext.context.avatar
        infoNode.firstName = updatePersonContext.context.firstName
        infoNode.middleName = updatePersonContext.context.middleName
        infoNode.lastName = updatePersonContext.context.lastName
        infoNode.birthDate = updatePersonContext.context.birthDate
        infoNode.occupation = updatePersonContext.context.occupation

        node.extraInfo = Gson().toJson(infoNode)
        node.gender = updatePersonContext.context.gender

        val session = sessionFactory.openSession()
        session.transaction.begin()
        session.persist(node)
        //create connections
        val relations = createRelations(updatePersonContext, tree, node)
        relations.forEach {relation ->
            session.persist(relation)
        }

        session.transaction.commit()

    }

    private fun createRelations(
        updatePersonContext: TreeUpdatePerson,
        tree: Tree,
        node: Person
    ): MutableSet<Relation> {
        val relations = mutableSetOf<Relation>()
        if (updatePersonContext.context.children?.isEmpty() == false) {
            creteChildConnections(updatePersonContext, tree, relations, node)
        }
        if (updatePersonContext.context.parents?.isEmpty() == false) {
            createParentConnection(updatePersonContext, tree, relations, node)
        }
        return relations
    }

    private fun createParentConnection(
        updatePersonContext: TreeUpdatePerson,
        tree: Tree,
        relations: MutableSet<Relation>,
        node: Person
    ) {
        updatePersonContext.context.parents!!.map { parent ->
            val personParent = tree.persons?.firstOrNull { it.id == parent.personId.toLong() }
                ?: throw NoSuchElementException("Person with id ${parent.personId} not found")
            relations.add(
                getParentRelation(node, personParent, parent)
            )
            //add person as child to parent
            relations.add(
                getChildRelation(personParent, node, parent)
            )
            personParent.relations?.filter { it.relationType == RelationType.CHILD.toString() }?.forEach {sibling ->
                relations.add(
                    getSiblingRelation(sibling.firstPerson!!, node, parent)
                )
                relations.add(
                    getSiblingRelation(node, sibling.firstPerson!!, parent)
                )
            }
        }
    }

    private fun creteChildConnections(
        updatePersonContext: TreeUpdatePerson,
        tree: Tree,
        relations: MutableSet<Relation>,
        node: Person
    ) {
        updatePersonContext.context.children!!.map { child ->
            val personChild = tree.persons?.firstOrNull { it.id == child.personId.toLong() }
                ?: throw NoSuchElementException("Person with id ${child.personId} not found")
            relations.add(
                getChildRelation(node, personChild, child)
            )
            //add person as parent to child
            relations.add(
                getParentRelation(personChild, node, child)
            )
        }
    }

    private fun getParentRelation(
        person: Person,
        parent: Person,
        connection: TreeUpdatePerson.Connection
    ) = mapRelation(person, parent, connection.connectionType, RelationType.PARENT)

    private fun getChildRelation(
        person: Person,
        child: Person,
        connection: TreeUpdatePerson.Connection
    ) = mapRelation(person, child, connection.connectionType, RelationType.CHILD)

    private fun getSiblingRelation(
        person: Person,
        sibling: Person,
        parent: TreeUpdatePerson.Connection
    ) = mapRelation(person, sibling, parent.connectionType, RelationType.SIBLING)

    private fun mapRelation(
        firstPerson: Person,
        secondPerson: Person,
        connectionType: TreeUpdatePerson.ConnectionType,
        relationType: RelationType

    ) = Relation(
        id = null,
        firstPerson = firstPerson,
        secondPerson = secondPerson,
        relationType = relationType.toString(),
        connectionType = connectionType.toString()
    )

    private fun delete(updatePersonContext: TreeUpdatePerson) {
        val nodeId = updatePersonContext.context.nodeId?.toLongOrNull() ?: throw Exception("Wrong node id")
        personRepository.deleteById(nodeId)
    }
}