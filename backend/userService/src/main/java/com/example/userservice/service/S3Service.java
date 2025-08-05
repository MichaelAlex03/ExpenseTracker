package com.example.userservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import java.time.Duration;

@Service
public class S3Service {

    private final S3Presigner presigner;
    private final String bucketName;
    private final String region;

    public S3Service(@Value("${aws.bucketName}") String bucketName,
                            @Value("${aws.region}") String region,
                            S3Presigner presigner) {
        this.bucketName = bucketName;
        this.region = region;
        this.presigner = presigner;
    }

    public String generatePresignedUploadUrl(String key, String contentType) {

        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .putObjectRequest(objectRequest)
                .signatureDuration(Duration.ofMinutes(5))
                .build();

        return presigner.presignPutObject(presignRequest).url().toString();
    }

    public String getPublicUrl(String key) {
        return "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + key;
    }
}
