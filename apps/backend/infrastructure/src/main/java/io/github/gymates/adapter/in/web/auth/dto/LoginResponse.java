package io.github.gymates.adapter.in.web.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
public class LoginResponse {
  private String token;
  private long expiresIn;
}
