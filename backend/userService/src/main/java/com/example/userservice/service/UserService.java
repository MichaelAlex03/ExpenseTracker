package com.example.userservice.service;

import com.example.userservice.dto.UpdateUserDto;
import com.example.userservice.model.User;
import com.example.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public Optional<User> getUserInfo(String email){
        return userRepository.findByUserEmail(email);
    }

    public User updateUser(UpdateUserDto input){
        Optional<User> user = userRepository.findByUserEmail(input.getUserEmail());
        if (user.isPresent()){
            User newUser = user.get();
            if (input.getUserEmail() != null){
                newUser.setUserEmail(input.getUserEmail());
            }
            if (input.getFirstName() != null){
                newUser.setFirstName(input.getFirstName());
            }
            if (input.getLastName() != null){
                newUser.setLastName(input.getLastName());
            }
            if(input.getNewPassword() != null){
                newUser.setPassword(input.getNewPassword());
            }
            if(input.getPhoneNumber() != null){
                newUser.setPhoneNumber(input.getPhoneNumber());
            }
            if(input.getDateOfBirth() != null){
                newUser.setDateOfBirth(input.getDateOfBirth());
            }
            if(input.getOccupation() != null){
                newUser.setOccupation(input.getOccupation());
            }
            if(input.getLocation() != null){
                newUser.setLocation(input.getLocation());
            }
            return userRepository.save(newUser);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public void deleteUser(String email){
        Optional<User> userToDelete = userRepository.findByUserEmail(email);
        if (userToDelete.isPresent()){
            User user = userToDelete.get();
            userRepository.delete(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }
}
