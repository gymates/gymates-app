package io.github.gymates.auth.register;

public record RegisterUserCommand(String username, String email, String password) {
}
