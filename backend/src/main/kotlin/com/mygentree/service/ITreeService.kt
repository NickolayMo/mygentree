package com.mygentree.service

import com.mygentree.dto.GenTree
import com.mygentree.data.Tree
import java.util.*

interface ITreeService {
    fun getTreeById(id: Long): GenTree
}