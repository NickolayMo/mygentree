package com.mygentree.data

import jakarta.persistence.*
import org.hibernate.annotations.ColumnTransformer


@Entity
@Table(name = "person")
class Person(
    @Id
    @SequenceGenerator(name="personSeq", sequenceName="person_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "personSeq")
    var id: Long?,

    @OneToMany(mappedBy = "firstPerson", cascade = [CascadeType.ALL])
    @OrderBy("id ASC")
    var relations: Set<Relation>?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tree_id")
    var tree: Tree?,

    @ColumnTransformer(write = "?::json")
    var extraInfo: String?,

    @ColumnTransformer(write = "?::gender")
    var gender: String?,

    var isMain: Boolean?
)

