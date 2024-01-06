package com.mygentree.exception

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ResponseStatus

@ResponseStatus(HttpStatus.NOT_FOUND)
class StorageFileNotFoundException(message: String?, cause: Throwable?): RuntimeException(message, cause)