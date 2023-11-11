package com.mygentree.data

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import org.hibernate.annotations.ColumnTransformer


@Entity
@Table(name = "tree")
class Tree(
    @Id
    @SequenceGenerator(name="treeSeq", sequenceName="tree_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "treeSeq")
    var id: Long? = null,

    @NotBlank
    var name: String,

    @NotBlank
    var userId: Long,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "tree")
    @OrderBy("id ASC")
    var persons: Set<Person>?,

    @ColumnTransformer(write = "?::json")
    var extraInfo: String?
)

//select p.id, r.first_person_id, r.second_person_id, r.relation_type, r.connection_type,rel_p.extra_info as rel_person_info from tree t
//join person p on p.tree_id=t.id
//join relation r on r.first_person_id = p.id
//join person rel_p on rel_p.id = r.second_person_id
//where t.id = 1
//and (p.deleted = false or p.deleted isnull)
//and (r.deleted = false or r.deleted isnull)