package com.mygentree.data

import com.mygentree.dto.LiveEvent

data class PersonInfoNode(
    var avatar: String? = null,
    var firstName: String? = null,
    var middleName: String? = null,
    var lastName: String? = null,
    var birthDate: String? = null,
    var occupation: String? = null,
    var location: String? = null,
    var liveEvents: List<LiveEvent>? = null,
    var personDocuments: List<String>? = null,
    var description: String? = null,
    var photoNames: List<String>? = null
)
