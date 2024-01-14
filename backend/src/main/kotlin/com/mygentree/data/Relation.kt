package com.mygentree.data

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant

@Entity
@Table(name="relations")
@JsonIgnoreProperties(
    value = ["createdAt", "updatedAt"],
    allowGetters = true
)
class Relation(
    @Id
    @SequenceGenerator(name = "relationSeq", sequenceName = "relations_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "relationSeq")
    var id: Long?,

    @ManyToOne
    @JoinColumn(name = "person_id")
    var person: Person?,

    @ManyToOne
    @JoinColumn(name = "related_person_id")
    var relatedPerson: Person?,

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "relation_type")
    var relationType: RelationType?,

    @NotBlank
    @ManyToOne
    @JoinColumn(name = "connection_type")
    var connectionType: ConnectionType?,

    @NotBlank
    @CreatedDate
    @Column(nullable = false, updatable = false)
    var createdAt: Instant = Instant.now(),

    @NotBlank
    @LastModifiedDate
    @Column(nullable = false, updatable = false)
    var updatedAt: Instant = Instant.now()

)