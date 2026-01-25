package io.github.gymates.user.model;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class VerificationUser {
    private String email;
    private String verificationCode;
}
