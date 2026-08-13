package com.zegel.users.users.service;

import com.zegel.users.users.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

@Service
@Slf4j
public class JwtService {

    @Value("${jwt.secret-key}")
    private String secretKey;

    @Value("${jwt.expiration-time}")
    private long expirationTime;

    public String generateToken(User user) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

        String roles = user.getRoles().stream()
            .map(role -> role.getName())
            .collect(Collectors.joining(","));

        Date now = new Date();
        Date expiresAt = new Date(System.currentTimeMillis() + expirationTime);

        return Jwts.builder()
            .subject(user.getEmail())
            .claim("userId", user.getId())
            .claim("firstName", user.getFirstName())
            .claim("lastName", user.getLastName())
            .claim("roles", roles)
            .issuedAt(now)
            .expiration(expiresAt)
            .signWith(key)
            .compact();
    }
}
