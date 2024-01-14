package com.mygentree.data

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import org.hibernate.annotations.NaturalId


@Entity
@Table(name = "tree_roles")
class TreeRole(
    @Id
    @SequenceGenerator(name="treeRoleSeq", sequenceName="tree_role_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "treeRoleSeq")
    var id: Long,

    @NotBlank
    @Enumerated(EnumType.STRING)
    @NaturalId
    @Size(max = 50)
    var name: TreeRoleName
)