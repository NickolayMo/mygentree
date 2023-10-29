package com.mygentree.data

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import jakarta.persistence.*
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import org.hibernate.annotations.NaturalId
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import java.time.Instant

@Entity
@Table(name = "users", uniqueConstraints = [
    UniqueConstraint(columnNames = ["email", "username"])
])
@JsonIgnoreProperties(
    value = ["createdAt", "updatedAt"],
    allowGetters = true
)
class User(
    @Id
    @SequenceGenerator(name="userSeq", sequenceName="users_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "userSeq")
    var id: Long? = null,

    @NotBlank
    @Size(max = 50)
    var name: String,

    @NotBlank
    @Size(max = 50)
    @Email
    @NaturalId
    var email: String,

    @NotBlank
    @Size(max = 50)
    @Email
    @NaturalId
    var username: String,

    @NotBlank
    @Size(max = 100)
    var password: String,

    @NotBlank
    var deleted: Boolean,

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "role_id")]
    )
    var roles: Set<Role>?,

    @NotBlank
    @CreatedDate
    @Column(nullable = false, updatable = false)
    var createdAt: Instant = Instant.now(),

    @NotBlank
    @LastModifiedDate
    @Column(nullable = false, updatable = false)
    var updatedAt: Instant = Instant.now()

)
