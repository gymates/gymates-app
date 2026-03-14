package io.github.gymates.adapter.in.web.auth.mappers;

import org.springframework.stereotype.Component;

import io.github.gymates.adapter.in.web.auth.dto.LoginResponse;
import io.github.gymates.adapter.in.web.auth.dto.RegisterResponse;
import io.github.gymates.auth.login.TokenData;
import io.github.gymates.user.model.User;

@Component
public class AuthResponseMapper {
  public RegisterResponse toRegisterResponse(User user) {
    return RegisterResponse.builder()
      .username(user.getUsername())
      .email(user.getEmail())
      .build();
  }

  public LoginResponse toLoginResponse(TokenData tokenData) {
    return new LoginResponse(tokenData.getToken(), tokenData.getExpirationTime());
  }
}
