package com.mygentree.service

import org.springframework.core.io.Resource
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Path

interface IStorageService {
    fun photoStore(file: MultipartFile): String
    fun docStore(file: MultipartFile): String
    fun get(filename: String): Path
    fun getPhotoAsResource(filename: String): Resource
    fun getDocAsResource(filename: String): Resource
    fun photoDelete(filename: String): Boolean
    fun docDelete(filename: String): Boolean
}