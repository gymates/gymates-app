package io.github.gymates.auth.register;

public record RegisterUserCommand(String username, String firstName, String lastName, String email, String password) {
}
