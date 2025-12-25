package io.github.gymates.auth.email;

import io.github.gymates.user.model.User;

public record VerifyUserCommand(User user) {

}
