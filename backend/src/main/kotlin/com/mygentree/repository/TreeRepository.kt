package com.mygentree.repository

import com.mygentree.business.dto.GenTree
import com.mygentree.business.service.UpdateConnectionContext
import com.mygentree.business.service.UpdatePersonContext

interface ITreeRepository {
    fun getById(id: String): GenTree
    fun updatePerson(updatePersonContext: UpdatePersonContext): GenTree?
    fun updateConnection(updateConnectionContext: UpdateConnectionContext): GenTree?
}