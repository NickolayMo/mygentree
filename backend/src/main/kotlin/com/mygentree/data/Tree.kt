package com.mygentree.data

import jakarta.persistence.*


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

//select p.id, r.first_person_id, r.second_person_id, r.relation_type, r.connection_type,rel_p.extra_info as rel_person_info from tree t
//join person p on p.tree_id=t.id
//join relation r on r.first_person_id = p.id
//join person rel_p on rel_p.id = r.second_person_id
//where t.id = 1
//and (p.deleted = false or p.deleted isnull)
//and (r.deleted = false or r.deleted isnull)