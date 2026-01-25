package io.github.gymates.adapter.in.web.auth.mappers;

import io.github.gymates.user.model.User;
import io.github.gymates.auth.login.TokenData;
import io.github.gymates.adapter.in.web.auth.dto.LoginResponse;
import io.github.gymates.adapter.in.web.auth.dto.RegisterResponse;
import org.springframework.stereotype.Component;

@Component
public class AuthResponseMapper {
  public RegisterResponse toRegisterResponse(User user) {
    return RegisterResponse.builder()
      .username(user.getUsername())
      .email(user.getEmail())
      .build();
  }

  public LoginResponse toLoginResponse(TokenData tokenData) {
    return LoginResponse.builder()
      .token(tokenData.getToken())
      .expiresIn(tokenData.getExpirationTime())
      .build();
  }
}
