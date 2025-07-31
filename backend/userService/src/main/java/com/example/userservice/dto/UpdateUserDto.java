package com.example.userservice.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class UpdateUserDto {
    private String firstName;
    private String lastName;
    private String userEmail;
    private String newPassword;
    private String phoneNumber;
    private Date dateOfBirth;
    private String occupation;
    private String location;
}
