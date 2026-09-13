package com.trustrent.backend.service;

import com.trustrent.backend.dto.AuthResponse;
import com.trustrent.backend.dto.LoginRequest;
import com.trustrent.backend.dto.RegisterRequest;
import com.trustrent.backend.entity.TrustScore;
import com.trustrent.backend.entity.User;
import com.trustrent.backend.repository.TrustScoreRepository;
import com.trustrent.backend.repository.UserRepository;
import com.trustrent.backend.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final TrustScoreRepository trustScoreRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, 
                       TrustScoreRepository trustScoreRepository, 
                       PasswordEncoder passwordEncoder, 
                       JwtService jwtService, 
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.trustScoreRepository = trustScoreRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findAll().stream().anyMatch(u -> u.getEmail().equals(request.email))) {
            throw new RuntimeException("Email is already registered.");
        }

        User user = new User();
        user.setName(request.name);
        user.setEmail(request.email);
        user.setPasswordHash(passwordEncoder.encode(request.password));
        user.setPhone(request.phone);
        user.setRole(request.role);

        User savedUser = userRepository.save(user);

        // Initialize default Trust Score = 500 (per PRD/Backend Schema)
        TrustScore trustScore = new TrustScore();
        trustScore.setUser(savedUser);
        trustScore.setScore(500);
        trustScore.setPaymentScore(500);
        trustScore.setRentalHistoryScore(500);
        trustScore.setReviewScore(500);
        trustScore.setCareScore(500);
        trustScore.setComplianceScore(500);
        trustScore.setComplaintScore(500);
        trustScore.setLastCalculatedAt(OffsetDateTime.now());
        trustScoreRepository.save(trustScore);

        String jwtToken = jwtService.generateToken(savedUser);

        return new AuthResponse(savedUser.getId(), savedUser.getName(), savedUser.getRole(), jwtToken);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email, request.password)
        );

        User user = userRepository.findAll().stream()
                .filter(u -> u.getEmail().equals(request.email))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User not found."));

        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(user.getId(), user.getName(), user.getRole(), jwtToken);
    }
}