package com.mygentree.service

import com.mygentree.data.Tree
import java.util.*

interface ITreeService {
    fun getTreeById(id: Long): Tree?
}