package com.mygentree.data

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import org.hibernate.annotations.NaturalId

@Entity
@Table(name = "genders")
class Gender(
    @Id
    @SequenceGenerator(name="gendersSeq", sequenceName="genders_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gendersSeq")
    var id: Long,

    @NotBlank
    @Enumerated(EnumType.STRING)
    @NaturalId
    @Size(max = 50)
    var gender: GenderTypeValue
)