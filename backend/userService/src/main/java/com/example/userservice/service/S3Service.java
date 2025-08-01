//package com.example.userservice.service;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//import software.amazon.awssdk.core.sync.RequestBody;
//import software.amazon.awssdk.services.s3.S3Client;
//import software.amazon.awssdk.services.s3.model.PutObjectRequest;
//
//import java.io.IOException;
//import java.util.UUID;
//
//@Service
//public class S3Service {
//    @Value("${aws.bucketName}")
//    private String bucketName;
//
//    private final S3Client s3Client;
//
//    public S3Service(S3Client s3Client){
//        this.s3Client = s3Client;
//    }
//
//    public String uploadFile(MultipartFile file) throws IOException {
//        String key = UUID.randomUUID() + "_" + file.getOriginalFilename();
//
//        PutObjectRequest putRequest = PutObjectRequest.builder()
//                .bucket(bucketName)
//                .key(key)
//                .acl("public-read")
//                .contentType(file.getContentType())
//                .build();
//
//        s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
//        return key;
//    }
//}
