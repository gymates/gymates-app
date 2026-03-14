package io.github.gymates.adapter.in.web.auth.dto;

public record LoginResponse(String token, long expiresIn) {}
