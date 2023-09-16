package com.mygentree.service

import com.mygentree.business.dto.GenTree
import com.mygentree.data.Tree
import java.util.*

interface ITreeService {
    fun getTreeById(id: Long): GenTree
}