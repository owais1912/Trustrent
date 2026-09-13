package com.trustrent.backend.controller;

import com.trustrent.backend.dto.TrustProfileResponse;
import com.trustrent.backend.service.TrustService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/trust")
public class TrustController {

    private final TrustService trustService;

    public TrustController(TrustService trustService) {
        this.trustService = trustService;
    }

    @GetMapping("/profile")
    public ResponseEntity<TrustProfileResponse> getMyTrustProfile(
            Authentication authentication) {

        String email = authentication.getName();

        TrustProfileResponse profile =
                trustService.getTrustProfileByEmail(email);

        return ResponseEntity.ok(profile);
    }
}