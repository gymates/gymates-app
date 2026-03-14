package io.github.gymates.adapter.in.web.auth.dto;

public record VerifyUserRequest(String email, String verificationCode) {}
