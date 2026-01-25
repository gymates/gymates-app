package io.github.gymates.auth.email;

import io.github.gymates.user.model.VerificationUser;

public record VerifyUserCommand(VerificationUser user) {

}
