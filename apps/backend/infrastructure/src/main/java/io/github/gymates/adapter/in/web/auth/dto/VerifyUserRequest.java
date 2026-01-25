package io.github.gymates.adapter.in.web.auth.dto;

import lombok.Getter;

@Getter
public class VerifyUserRequest {
    private String email;
    private String verificationCode;
}
