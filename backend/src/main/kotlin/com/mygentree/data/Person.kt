package com.mygentree.data

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jdk.jfr.BooleanFlag
import org.hibernate.annotations.ColumnTransformer
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant
import kotlin.jvm.Transient


@Entity
@Table(name = "persons")
@JsonIgnoreProperties(
    value = ["createdAt", "updatedAt"],
    allowGetters = true
)
class Person(
    @Id
    @SequenceGenerator(name = "personSeq", sequenceName = "persons_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "personSeq")
    var id: Long?,

    @OneToMany(mappedBy = "person", cascade = [CascadeType.ALL])
    @OrderBy("id ASC")
    var relations: Set<Relation>?,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tree_id")
    var tree: Tree?,

    @ColumnTransformer(write = "?::json")
    var extraInfo: String?,

    @NotNull
    var isMain: Boolean?,

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gender")
    var gender: Gender?,

    @NotBlank
    @CreatedDate
    @Column(nullable = false, updatable = false)
    var createdAt: Instant = Instant.now(),

    @NotBlank
    @LastModifiedDate
    @Column(nullable = false, updatable = false)
    var updatedAt: Instant = Instant.now()
)

