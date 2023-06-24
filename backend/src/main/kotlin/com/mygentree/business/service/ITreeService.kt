package com.mygentree.business.service

import com.mygentree.business.dto.GenTree

interface ITreeService {
    fun getTreeById(id: String): GenTree?
    fun updatePerson(updatePeronContext: UpdatePersonContext): GenTree?
    fun updateConnection(updateConnectionContext: UpdateConnectionContext): GenTree?
}