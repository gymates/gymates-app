package io.github.gymates.auth.login;

public interface LoginUserUseCase {
  TokenData loginUser(LoginUserCommand command);
}
