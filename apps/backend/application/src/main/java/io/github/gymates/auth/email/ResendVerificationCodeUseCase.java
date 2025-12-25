package io.github.gymates.auth.email;

public interface ResendVerificationCodeUseCase {
  void resendVerificationCode(ResendVerificationCodeCommand command);
}
