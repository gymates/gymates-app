package io.github.gymates.adapter.in.web.auth.dto;

import lombok.Builder;

@Builder
public class RegisterResponse {
  private String username;
  private String email;
}
