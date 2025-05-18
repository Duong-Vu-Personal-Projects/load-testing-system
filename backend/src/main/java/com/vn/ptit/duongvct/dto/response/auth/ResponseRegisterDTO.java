package com.vn.ptit.duongvct.dto.response.auth;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class ResponseRegisterDTO {
    private String id;
    private String username;
    private String email;
    private String fullName;
    private Instant createdAt;
}
