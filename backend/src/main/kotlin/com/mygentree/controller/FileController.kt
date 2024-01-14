package com.mygentree.controller

import com.mygentree.dto.response.ApiResponse
import com.mygentree.dto.response.UploadResponse
import com.mygentree.exception.StorageFileNotFoundException
import com.mygentree.service.IStorageService
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.Resource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@Controller
@RequestMapping("/api/v1/file")
class FileController(
    @Autowired
    val storageService: IStorageService,
    @Value("\${file.photoServerUrl}")
    val photoFileServerUrl: String,

    @Value("\${file.docServerUrl}")
    val docFileServerUrl: String
) {
    @PostMapping("/photo/upload")
    @ResponseBody
    @PreAuthorize("hasRole('USER')")
    fun photoUpload(@RequestParam file: MultipartFile): ResponseEntity<ApiResponse<UploadResponse>> {
        val filename = storageService.photoStore(file)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                data = UploadResponse(
                    filename = filename,
                    url = photoFileServerUrl+filename
                ),
                error = null
            )
        )
    }

    @PostMapping("/doc/upload")
    @ResponseBody
    @PreAuthorize("hasRole('USER')")
    fun docUpload(@RequestParam file: MultipartFile): ResponseEntity<ApiResponse<UploadResponse>> {
        val filename = storageService.docStore(file)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                data = UploadResponse(
                    filename = filename,
                    url = photoFileServerUrl+filename
                ),
                error = null
            )
        )
    }

    @GetMapping("/photo/serve/{filename:.+}")
    @ResponseBody
    fun photoServe(@PathVariable filename: String): ResponseEntity<Resource> {
        val file = storageService.getPhotoAsResource(filename)
        return ResponseEntity
            .ok()
            .contentType(MediaType.IMAGE_JPEG)
            .body(file)
    }

    @GetMapping("/doc/serve/{filename:.+}")
    @ResponseBody
    @PreAuthorize("hasRole('USER')")
    fun docServe(@PathVariable filename: String): ResponseEntity<Resource> {
        val file = storageService.getDocAsResource(filename)
        return ResponseEntity.ok().header(
            HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"" + file.getFilename() + "\""
        ).body(file);
    }

    @DeleteMapping("/photo/delete/{filename:.+}")
    @ResponseBody
    @PreAuthorize("hasRole('USER')")
    fun photoDelete(@PathVariable filename: String): ResponseEntity<ApiResponse<Boolean>> {
        val res = storageService.photoDelete(filename)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                data = res,
                error = null
            )
        )
    }

    @DeleteMapping("/doc/delete/{filename:.+}")
    @ResponseBody
    @PreAuthorize("hasRole('USER')")
    fun docDelete(@PathVariable filename: String): ResponseEntity<ApiResponse<Boolean>> {
        val res = storageService.docDelete(filename)
        return ResponseEntity.ok(
            ApiResponse(
                success = true,
                data = res,
                error = null
            )
        )
    }

    @ExceptionHandler(StorageFileNotFoundException::class)
    fun handleStorageFileNotFound(exc: StorageFileNotFoundException?): ResponseEntity<*> {
        return ResponseEntity.notFound().build<Any>()
    }
}