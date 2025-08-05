package com.example.userservice.controller;

import com.example.userservice.service.S3Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/s3")
public class S3Controller {

    private final S3Service s3Service;

    public S3Controller(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @GetMapping("/presigned-url")
    public ResponseEntity<?> getPresignedUrl(@RequestParam String fileType) {
        if (fileType == null || fileType.isEmpty()) {
            return ResponseEntity.badRequest().body("fileType is required");
        }

        String fileExtension = fileType.split("/")[1];
        String key = UUID.randomUUID() + "." + fileExtension;

        String uploadUrl = s3Service.generatePresignedUploadUrl(key, fileType);
        String publicUrl = s3Service.getPublicUrl(key);

        Map<String, String> response = Map.of(
                "uploadUrl", uploadUrl,
                "key", key,
                "publicUrl", publicUrl
        );

        return ResponseEntity.ok(response);
    }
}

