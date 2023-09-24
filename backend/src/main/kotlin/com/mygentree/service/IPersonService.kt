package com.mygentree.service

import com.mygentree.dto.GenTree
import com.mygentree.dto.TreeUpdatePerson

interface IPersonService {
    fun updatePerson(updatePersonContext: TreeUpdatePerson): GenTree?
}