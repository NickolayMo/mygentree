package com.mygentree.service

import com.mygentree.security.UserPrincipal
import io.minio.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.io.InputStreamResource
import org.springframework.core.io.Resource
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Path
import java.util.*


@Service
class StorageService(
    @Autowired
    val minioClient: MinioClient,
) : IStorageService {
    companion object {
        const val PHOTO_BUKET = "user-%s-photo"
        const val DOC_BUKET = "user-%s-doc"
    }

    private fun getPhotoBuket(): String {
        val userPrincipal = SecurityContextHolder.getContext().authentication.principal as UserPrincipal
        return String.format(PHOTO_BUKET, userPrincipal.id.toString())
    }

    private fun getDocBuket(): String {
        val userPrincipal = SecurityContextHolder.getContext().authentication.principal as UserPrincipal
        return String.format(DOC_BUKET, userPrincipal.id.toString())
    }

    override fun docStore(file: MultipartFile): String {
        val bucketName = getPhotoBuket()
        return store(bucketName, file)

    }

    override fun photoStore(file: MultipartFile): String {
        val bucketName = getPhotoBuket()
        return store(bucketName, file)
    }

    override fun get(filename: String): Path {
        TODO("Not yet implemented")
    }


    override fun docDelete(filename: String): Boolean {
        val bucketName = getDocBuket()
        remove(bucketName, filename)
        return true
    }

    override fun photoDelete(filename: String): Boolean {
        val bucketName = getPhotoBuket()
        remove(bucketName, filename)
        return true
    }

    override fun getDocAsResource(filename: String): Resource {
        val bucketName = getDocBuket()
        return getInputStreamResource(bucketName, filename)
    }

    override fun getPhotoAsResource(filename: String): Resource {
        val bucketName = getPhotoBuket()
        return getInputStreamResource(bucketName, filename)
    }


    private fun getInputStreamResource(
        bucketName: String,
        filename: String
    ): InputStreamResource {
        val stream = minioClient.getObject(
            GetObjectArgs
                .builder()
                .bucket(bucketName)
                .`object`(filename)
                .build()
        )
        return InputStreamResource(stream)
    }


    private fun remove(bucketName: String, filename: String) {
        minioClient.removeObject(
            RemoveObjectArgs
                .builder()
                .bucket(bucketName)
                .`object`(filename)
                .build()
        )
    }

    private fun store(bucketName: String, file: MultipartFile) : String {
        val found = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build())
        if (!found) {
            minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build())
        } else {
            println("Bucket" + bucketName + "already exists.")
        }
        val inputStream = file.inputStream
        val filename = UUID.randomUUID().toString()
        minioClient.putObject(
            PutObjectArgs.builder()
                .bucket(bucketName)
                .`object`(filename)
                .stream(inputStream, inputStream.available().toLong(), -1)
                .build()
        )
        return filename
    }
}