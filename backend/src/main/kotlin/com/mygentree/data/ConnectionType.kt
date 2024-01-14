package com.mygentree.data

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import org.hibernate.annotations.NaturalId

@Entity
@Table(name = "connection_types")
class ConnectionType(
    @Id
    @SequenceGenerator(name="connectionTypeSeq", sequenceName="connection_types_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "connectionTypesSeq")
    var id: Long,

    @NotBlank
    @Enumerated(EnumType.STRING)
    @NaturalId
    @Size(max = 50)
    var connectionType: ConnectionTypeValue
)