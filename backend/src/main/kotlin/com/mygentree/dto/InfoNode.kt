package com.mygentree.dto

data class InfoNode(
    var avatar: String? = null,
    var firstName: String? = null,
    var middleName: String? = null,
    var lastName: String? = null,
    var birthDate: String? = null,
    var occupation: String? = null,
    var location: String? = null,
    var liveEvents: List<LiveEvent>? = null,
    var personDocuments: List<PersonDocuments>? = null,
    var description: String? = null
)
