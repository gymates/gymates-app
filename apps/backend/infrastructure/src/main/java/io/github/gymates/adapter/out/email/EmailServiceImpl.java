package io.github.gymates.adapter.out.email;

import java.util.Objects;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import io.github.gymates.auth.email.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {
  private final JavaMailSender mailSender;

  @Override
  public void sendEmail(String to, String subject, String text) {
    Objects.requireNonNull(to, "Recipient address must not be null");
    Objects.requireNonNull(subject, "Email subject must not be null");
    Objects.requireNonNull(text, "Email body must not be null");

    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true);

      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(text, true);

      mailSender.send(message);
      log.info("Verification email sent to {}", to);
    } catch (MessagingException e) {
      log.error("Failed to send email to {}: {}", to, e.getMessage(), e);
      throw new RuntimeException("Failed to send verification email to: " + to, e);
    }
  }
}
