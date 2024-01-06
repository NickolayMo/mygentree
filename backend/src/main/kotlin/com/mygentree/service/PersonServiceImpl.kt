package com.mygentree.service

import com.google.gson.Gson
import com.mygentree.data.*
import com.mygentree.dto.GenTree
import com.mygentree.dto.InfoNode
import com.mygentree.dto.TreeUpdatePerson
import com.mygentree.repository.PersonRepository
import com.mygentree.repository.TreeRepository
import jakarta.persistence.EntityNotFoundException
import org.hibernate.SessionFactory
import org.springframework.beans.factory.annotation.Autowired

import org.springframework.stereotype.Service

@Service
class PersonServiceImpl(
    @Autowired
    val personRepository: PersonRepository,
    @Autowired
    val treeRepository: TreeRepository,
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

    private fun update(updatePersonContext: TreeUpdatePerson) {
        val tree = treeRepository.findByIdAndUserId(updatePersonContext.treeId.toLong(), updatePersonContext.userId)
            .orElseThrow()
        val nodeId = updatePersonContext.context.nodeId?.toLongOrNull() ?: throw Exception("Wrong node id")
        val node = personRepository.findByIdAndTreeId(nodeId, tree.id)
            .orElseThrow { EntityNotFoundException("Entity not found") }
        node.gender = updatePersonContext.context.gender
        var infoNode = PersonInfoNode()
        val extraInfo = node.extraInfo
        if (extraInfo != null) {
            infoNode = Gson().fromJson(extraInfo, PersonInfoNode::class.java)
        }
        infoNode.avatar = updatePersonContext.context.avatar
        infoNode.firstName = updatePersonContext.context.firstName
        infoNode.middleName = updatePersonContext.context.middleName
        infoNode.lastName = updatePersonContext.context.lastName
        infoNode.birthDate = updatePersonContext.context.birthDate
        infoNode.occupation = updatePersonContext.context.occupation
        infoNode.photoNames = updatePersonContext.context.photoNames

        node?.extraInfo = Gson().toJson(infoNode)
        val session = sessionFactory.openSession()
        try {
            session.transaction.begin()
            personRepository.save(node)
            val relations = createRelations(updatePersonContext, tree, node)
            relations.forEach { relation ->
                session.persist(relation)
            }
            session.transaction.commit()
        } catch (e: Exception) {
            session.close()
        } finally {
            session.close()
        }

    }


    private fun create(updatePersonContext: TreeUpdatePerson) {
        val tree = treeRepository.findByIdAndUserId(updatePersonContext.treeId.toLong(), updatePersonContext.userId)
            .orElseThrow()
        val node = Person(
            id = null,
            relations = setOf(),
            tree = tree,
            extraInfo = null,
            gender = updatePersonContext.context.gender,
            isMain = false
        )

        val infoNode = PersonInfoNode()
        infoNode.avatar = updatePersonContext.context.avatar
        infoNode.firstName = updatePersonContext.context.firstName
        infoNode.middleName = updatePersonContext.context.middleName
        infoNode.lastName = updatePersonContext.context.lastName
        infoNode.birthDate = updatePersonContext.context.birthDate
        infoNode.occupation = updatePersonContext.context.occupation
        infoNode.photoNames = updatePersonContext.context.photoNames

        node.extraInfo = Gson().toJson(infoNode)
        node.gender = updatePersonContext.context.gender

        val session = sessionFactory.openSession().use {
            it.transaction.begin()
            it.persist(node)
            //create connections
            val relations = createRelations(updatePersonContext, tree, node)
            relations.forEach { relation ->
                it.persist(relation)
            }
            it.transaction.commit()
        }
    }

    private fun createRelations(
        updatePersonContext: TreeUpdatePerson,
        tree: Tree,
        node: Person
    ): MutableSet<Relation> {
        val relations = mutableSetOf<Relation>()
        if (updatePersonContext.context.children?.isEmpty() == false) {
            relations.addAll(creteChildConnections(updatePersonContext, tree, node))
        }
        if (updatePersonContext.context.parents?.isEmpty() == false) {
            relations.addAll(createParentConnection(updatePersonContext, tree, node))
        }
        if (updatePersonContext.context.spouses?.isEmpty() == false) {
            relations.addAll(createSpouseConnection(updatePersonContext, tree, node))
        }
        return relations
    }

    private fun createSpouseConnection(
        updatePersonContext: TreeUpdatePerson,
        tree: Tree,
        node: Person
    ): Set<Relation> {
        val relations = mutableSetOf<Relation>()
        updatePersonContext.context.spouses!!.map { spouse ->
            val personSpouse = tree.persons?.firstOrNull { it.id == spouse.personId.toLong() }
                ?: throw NoSuchElementException("Person with id ${spouse.personId} not found")
            relations.add(
                getSpouseRelation(node, personSpouse, spouse.connectionType)
            )
            relations.add(
                getSpouseRelation(personSpouse, node, spouse.connectionType)
            )

        }
        return relations
    }

    private fun createParentConnection(
        updatePersonContext: TreeUpdatePerson,
        tree: Tree,
        node: Person
    ): Set<Relation> {
        val relations = mutableSetOf<Relation>()
        updatePersonContext.context.parents!!.map { parent ->
            val personParent = tree.persons?.firstOrNull { it.id == parent.personId.toLong() }
                ?: throw NoSuchElementException("Person with id ${parent.personId} not found")
            relations.add(
                getParentRelation(node, personParent, parent.connectionType)
            )
            //add sibling relations
            personParent.relations?.filter { it.relationType == RelationType.CHILD.toString() }?.forEach { sibling ->
                relations.add(
                    getSiblingRelation(sibling.person!!, node, parent.connectionType)
                )
                relations.add(
                    getSiblingRelation(node, sibling.person!!, parent.connectionType)
                )
            }
            //add person as child to parent
            relations.add(
                getChildRelation(personParent, node, parent.connectionType)
            )

        }
        return relations
    }

    private fun creteChildConnections(
        updatePersonContext: TreeUpdatePerson,
        tree: Tree,
        node: Person
    ): Set<Relation> {
        val relations = mutableSetOf<Relation>()
        updatePersonContext.context.children!!.map { child ->
            val personChild = tree.persons?.firstOrNull { it.id == child.personId.toLong() }
                ?: throw NoSuchElementException("Person with id ${child.personId} not found")
            relations.add(
                getChildRelation(node, personChild, child.connectionType)
            )
            //add person as parent to child
            relations.add(
                getParentRelation(personChild, node, child.connectionType)
            )
        }
        return relations
    }

    private fun getParentRelation(
        person: Person,
        parent: Person,
        connection: TreeUpdatePerson.ConnectionType
    ) = mapRelation(person, parent, connection, RelationType.PARENT)

    private fun getSpouseRelation(
        person: Person,
        spouse: Person,
        connection: TreeUpdatePerson.ConnectionType
    ) = mapRelation(person, spouse, connection, RelationType.SPOUSE)

    private fun getChildRelation(
        person: Person,
        child: Person,
        connection: TreeUpdatePerson.ConnectionType
    ) = mapRelation(person, child, connection, RelationType.CHILD)

    private fun getSiblingRelation(
        person: Person,
        sibling: Person,
        connection: TreeUpdatePerson.ConnectionType
    ) = mapRelation(person, sibling, connection, RelationType.SIBLING)

    private fun mapRelation(
        person: Person,
        relatedPerson: Person,
        connectionType: TreeUpdatePerson.ConnectionType,
        relationType: RelationType
    ) = Relation(
        id = null,
        person = person,
        relatedPerson = relatedPerson,
        relationType = relationType.toString(),
        connectionType = connectionType.toString()
    )

    private fun delete(updatePersonContext: TreeUpdatePerson) {
        val tree = treeRepository.findByIdAndUserId(updatePersonContext.treeId.toLong(), updatePersonContext.userId)
            .orElseThrow()
        val nodeId = updatePersonContext.context.nodeId?.toLongOrNull() ?: throw Exception("Wrong node id")
        sessionFactory.openSession().use {
            it.transaction.begin()
            val relationQueryDelete =
                it.createNativeMutationQuery("delete from relation where person_id=:ID or related_person_id=:ID")
            relationQueryDelete.setParameter("ID", nodeId)
            relationQueryDelete.executeUpdate()
            val personQueryDelete =
                it.createNativeMutationQuery("delete from person where id=:ID and tree_id=:TREE_ID")
            personQueryDelete.setParameter("ID", nodeId)
            personQueryDelete.setParameter("TREE_ID", tree.id)
            personQueryDelete.executeUpdate()
            it.transaction.commit()
        }
    }
}