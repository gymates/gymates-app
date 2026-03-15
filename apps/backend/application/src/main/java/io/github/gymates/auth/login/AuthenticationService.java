package io.github.gymates.auth.login;

public interface AuthenticationService {
  void authenticate(String username, String password);
}
