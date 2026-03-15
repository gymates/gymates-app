package io.github.gymates.auth.email;

public interface EmailService {
  void sendEmail(String to, String subject, String content);
}
