package com.mygentree.data

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import org.hibernate.annotations.NaturalId


@Entity
@Table(name = "app_roles")
class AppRole(
    @Id
    @SequenceGenerator(name="appRoleSeq", sequenceName="app_role_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "appRoleSeq")
    var id: Long,

    @NotBlank
    @Enumerated(EnumType.STRING)
    @NaturalId
    @Size(max = 50)
    var name: AppRoleName
)