package io.github.gymates.auth.login;

import io.github.gymates.user.model.User;

public interface TokenService {
  String generateToken(User user);
  Long getExpirationTime();
}
