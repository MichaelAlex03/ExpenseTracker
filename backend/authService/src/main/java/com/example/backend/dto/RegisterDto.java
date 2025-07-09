package com.example.backend.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterDto {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
}
