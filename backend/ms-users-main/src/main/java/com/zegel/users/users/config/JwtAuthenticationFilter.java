package com.zegel.users.users.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret-key}")
    private String secretKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String token = extractTokenFromRequest(request);
            if (token != null && validateToken(token)) {
                Authentication auth = getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        } catch (Exception e) {
            log.debug("JWT validation failed: {}", e.getMessage());
        }
        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    private boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
            Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            log.debug("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    private Authentication getAuthentication(String token) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());
        Claims claims = Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();

        String email = claims.getSubject();
        Object rolesObj = claims.get("roles");

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        if (rolesObj instanceof List<?>) {
            List<?> rolesList = (List<?>) rolesObj;
            for (Object role : rolesList) {
                if (role != null) {
                    addAuthorityWithAndWithoutPrefix(authorities, role.toString());
                }
            }
        } else if (rolesObj instanceof String rolesStr && !rolesStr.isEmpty()) {
            Arrays.stream(rolesStr.split(","))
                .map(String::trim)
                .forEach(r -> addAuthorityWithAndWithoutPrefix(authorities, r));
        }

        return new UsernamePasswordAuthenticationToken(email, null, authorities);
    }

    private void addAuthorityWithAndWithoutPrefix(List<SimpleGrantedAuthority> authorities, String roleName) {
        authorities.add(new SimpleGrantedAuthority(roleName));
        if (roleName.startsWith("ROLE_")) {
            authorities.add(new SimpleGrantedAuthority(roleName.substring(5)));
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + roleName));
        }
    }
}