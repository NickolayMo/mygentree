package com.mygentree.repository

import com.google.gson.Gson
import com.mygentree.dto.GenTree
import com.mygentree.repository.mock.mock
import org.springframework.stereotype.Component

@Component
class MockTreeRepository {

    private val mockTree = Gson().fromJson(mock, GenTree::class.java)
    fun getById(id: String): GenTree {
        return mockTree
    }
}