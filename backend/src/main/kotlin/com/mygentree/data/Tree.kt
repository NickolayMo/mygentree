package com.mygentree.data

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.io.Serializable


@Entity
class Tree(
    var name: String,
    @Id
    @GeneratedValue
    var id: Long? = null,
    @OneToMany(mappedBy = "tree")
    @OrderBy("id ASC")
    var persons: Set<Person>?
)

@Entity
class Person(
    @Id
    @GeneratedValue
    var id: Long?,
    @OneToMany(mappedBy = "firstPerson")
    @OrderBy("id ASC")
    var relations: Set<Relation>?,
    @ManyToOne
    @JoinColumn(name = "tree_id")
    var tree: Tree?,
    var extraInfo: String?,
    var gender: String?,
    var isMain: Boolean?
)

@Entity
class Relation(
    @Id
    @GeneratedValue
    var id: Long?,
    @ManyToOne
    @JoinColumn(name = "first_person_id")
    var firstPerson: Person?,
    @ManyToOne
    @JoinColumn(name = "second_person_id")
    var secondPerson: Person?,
    var relationType: String?,
    var connectionType: String?
)

enum class RelationType{
    PARENT,
    CHILD,
    SIBLING,
    SPOUSE,
}

enum class ConnectionType{
    BLOOD,
    MARRIED,
    DIVORCED,
    ADOPTED,
    HALF
}

//select p.id, r.first_person_id, r.second_person_id, r.relation_type, r.connection_type,rel_p.extra_info as rel_person_info from tree t
//join person p on p.tree_id=t.id
//join relation r on r.first_person_id = p.id
//join person rel_p on rel_p.id = r.second_person_id
//where t.id = 1
//and (p.deleted = false or p.deleted isnull)
//and (r.deleted = false or r.deleted isnull)