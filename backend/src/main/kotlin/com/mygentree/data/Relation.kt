package com.mygentree.data

import jakarta.persistence.*
import org.hibernate.annotations.ColumnTransformer
import org.hibernate.annotations.GenericGenerator

@Entity
class Relation(
    @Id
    @SequenceGenerator(name="relationSeq", sequenceName="relation_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "relationSeq")
    var id: Long?,
    @ManyToOne
    @JoinColumn(name = "first_person_id")
    var firstPerson: Person?,
    @ManyToOne
    @JoinColumn(name = "second_person_id")
    var secondPerson: Person?,
    @ColumnTransformer(write = "?::relation_type")
    var relationType: String?,
    @ColumnTransformer(write = "?::connection_type")
    var connectionType: String?
)