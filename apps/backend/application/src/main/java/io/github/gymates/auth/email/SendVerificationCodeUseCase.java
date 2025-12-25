package io.github.gymates.auth.email;

public interface SendVerificationCodeUseCase {
  void sendVerificationCode(SendVerificationCodeCommand command);

}
