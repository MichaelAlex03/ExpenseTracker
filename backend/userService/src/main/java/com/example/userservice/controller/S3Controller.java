//package com.example.userservice.controller;
//
//import com.example.userservice.service.S3Service;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//
//@RestController
//@RequestMapping("/api/files")
//public class S3Controller {
//    private final S3Service s3Service;
//
//    public S3Controller(S3Service s3Service){
//        this.s3Service = s3Service;
//    }
//
//    @PostMapping("/upload")
//    public ResponseEntity<String> uploadFile(@RequestParam("file")MultipartFile file) throws IOException{
//        String key = s3Service.uploadFile(file);
//        return ResponseEntity.ok("https://my-app-uploads.s3.amazonaws.com/" + key);
//    }
//}
