package com.vn.ptit.duongvct.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestRegisterDTO {

    @NotBlank(message = "Please enter your email")
    private String email;
    @NotBlank(message = "Please enter your full name")
    private String fullName;
    @NotBlank(message = "Please enter your password")
    private String password;
    @NotBlank(message = "Please enter your username")
    private String username;
}
