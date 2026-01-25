package io.github.gymates.adapter.in.web.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class RegisterResponse {
  private String username;
  private String email;
}
