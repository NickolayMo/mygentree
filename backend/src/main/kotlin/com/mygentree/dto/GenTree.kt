package com.mygentree.dto

data class GenTree(
    val relatives: MutableList<GenTreeNode>,
    val treeId: Long?,
    val extraInfo: String?
)