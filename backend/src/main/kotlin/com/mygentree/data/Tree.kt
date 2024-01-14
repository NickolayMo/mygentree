package com.mygentree.data

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import org.hibernate.annotations.ColumnTransformer
import org.hibernate.annotations.Filter
import org.hibernate.annotations.Where
import org.hibernate.annotations.WhereJoinTable
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant
import kotlin.jvm.Transient


@Entity
@Table(name = "trees")
@JsonIgnoreProperties(
    value = ["createdAt", "updatedAt"],
    allowGetters = true
)
class Tree(
    @Id
    @SequenceGenerator(name = "treesSeq", sequenceName = "trees_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "treesSeq")
    var id: Long? = null,

    @NotBlank
    var name: String,

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "tree")
    @OrderBy("id ASC")
    var persons: Set<Person>?,

    @Transient
    var roles: Set<TreeRole>?,

    @ColumnTransformer(write = "?::json")
    var extraInfo: String?,

    @NotBlank
    @CreatedDate
    @Column(nullable = false, updatable = false)
    var createdAt: Instant = Instant.now(),

    @NotBlank
    @LastModifiedDate
    @Column(nullable = false, updatable = false)
    var updatedAt: Instant = Instant.now()
)