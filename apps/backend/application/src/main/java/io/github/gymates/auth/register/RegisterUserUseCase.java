package io.github.gymates.auth.register;

import io.github.gymates.user.model.User;

public interface RegisterUserUseCase {
  User registerUser(RegisterUserCommand command);
}
