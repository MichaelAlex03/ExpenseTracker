package com.example.userservice.responses;

import java.util.Date;
import lombok.Getter;

@Getter
public class UserUpdateResponse {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Date dateOfBirth;
    private String occupation;
    private String location;

    public UserUpdateResponse(
            String firstName,
            String lastName,
            String email,
            String phoneNumber,
            Date dateOfBirth,
            String occupation,
            String location
    ){
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.occupation = occupation;
        this.location = location;
    }
}
