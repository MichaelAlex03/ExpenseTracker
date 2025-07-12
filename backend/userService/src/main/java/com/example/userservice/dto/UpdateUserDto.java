package com.example.userservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserDto {
    private String firstName;
    private String lastName;
    private String userEmail;
    private String password;
}
