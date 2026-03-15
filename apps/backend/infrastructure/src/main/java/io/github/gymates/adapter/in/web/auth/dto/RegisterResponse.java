package io.github.gymates.adapter.in.web.auth.dto;

public record RegisterResponse(String email, boolean requiresEmailVerification) {}
