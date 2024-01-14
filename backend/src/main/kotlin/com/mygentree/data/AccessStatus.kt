package com.mygentree.data

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import org.hibernate.annotations.NaturalId

@Entity
@Table(name = "access_statuses")
class AccessStatus(
    @Id
    @SequenceGenerator(name="accessStatusSeq", sequenceName="access_status_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "accessStatusSeq")
    var id: Long,

    @NotBlank
    @Enumerated(EnumType.STRING)
    @NaturalId
    @Size(max = 50)
    var status: AccessStatusValue
)