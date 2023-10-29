package com.mygentree.security

import io.jsonwebtoken.*
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey


@Component
class JwtTokenProvider {
    companion object {
        val logger: Logger = LoggerFactory.getLogger(JwtTokenProvider::class.java)
    }


    @Value("\${app.jwtSecret}")
    private val jwtSecret: String? = null

    @Value("\${app.jwtExpirationInMs}")
    private val jwtExpirationInMs = 0

    fun generateToken(authentication: Authentication): String? {
        val userPrincipal = authentication.principal as UserPrincipal
        val now = Date()
        val expiryDate = Date(now.time + jwtExpirationInMs)
        return Jwts
            .builder()
            .subject(userPrincipal.id.toString())
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(signKey())
            .compact()
    }
    fun signKey(): SecretKey {
        val keyBytes = Decoders.BASE64.decode(jwtSecret)
        val key = Keys.hmacShaKeyFor(keyBytes)
        return key
    }

    fun getUserIdFromJWT(token: String?): Long {
        val claims = Jwts.parser()
            .verifyWith(signKey())
            .build()
            .parseSignedClaims(token)
            .payload
        return claims.subject.toLong()
    }

    fun validateToken(authToken: String?): Boolean {
        try {
            Jwts.parser().verifyWith(signKey()).build().parseSignedClaims(authToken)
            return true
        } catch (ex: SecurityException) {
            logger.error("Invalid JWT signature")
        } catch (ex: MalformedJwtException) {
            logger.error("Invalid JWT token")
        } catch (ex: ExpiredJwtException) {
            logger.error("Expired JWT token")
        } catch (ex: UnsupportedJwtException) {
            logger.error("Unsupported JWT token")
        } catch (ex: IllegalArgumentException) {
            logger.error("JWT claims string is empty.")
        }
        return false
    }

}

//
//@Component
//class JwtService {
//    fun generateToken(userName: String): String {
//        val claims: Map<String, Any> = HashMap()
//        return createToken(claims, userName)
//    }
//
//    private fun createToken(claims: Map<String, Any>, userName: String): String {
//        return Jwts.builder()
//            .setClaims(claims)
//            .setSubject(userName)
//            .setIssuedAt(Date(System.currentTimeMillis()))
//            .setExpiration(Date(System.currentTimeMillis() + 1000 * 60 * 30))
//            .signWith(signKey, SignatureAlgorithm.HS256).compact()
//    }
//
//    private val signKey: Key
//        private get() {
//            val keyBytes = Decoders.BASE64.decode(SECRET)
//            return Keys.hmacShaKeyFor(keyBytes)
//        }
//
//    fun extractUsername(token: String?): String {
//        return extractClaim(token) { obj: Claims -> obj.subject }
//    }
//
//    fun extractExpiration(token: String?): Date {
//        return extractClaim(token) { obj: Claims -> obj.expiration }
//    }
//
//    fun <T> extractClaim(token: String?, claimsResolver: Function<Claims, T>): T {
//        val claims = extractAllClaims(token)
//        return claimsResolver.apply(claims)
//    }
//
//    private fun extractAllClaims(token: String?): Claims {
//        return Jwts
//            .parserBuilder()
//            .setSigningKey(signKey)
//            .build()
//            .parseClaimsJws(token)
//            .getBody()
//    }
//
//    private fun isTokenExpired(token: String?): Boolean {
//        return extractExpiration(token).before(Date())
//    }
//
//    fun validateToken(token: String?, userDetails: UserDetails): Boolean {
//        val username = extractUsername(token)
//        return username == userDetails.username && !isTokenExpired(token)
//    }
//
//    companion object {
//        const val SECRET = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437"
//    }
//}


