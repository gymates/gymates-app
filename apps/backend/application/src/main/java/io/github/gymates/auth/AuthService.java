package io.github.gymates.auth;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import io.github.gymates.auth.email.EmailService;
import io.github.gymates.auth.email.ResendVerificationCodeCommand;
import io.github.gymates.auth.email.ResendVerificationCodeUseCase;
import io.github.gymates.auth.email.SendVerificationCodeCommand;
import io.github.gymates.auth.email.SendVerificationCodeUseCase;
import io.github.gymates.auth.email.VerifyUserCommand;
import io.github.gymates.auth.email.VerifyUserUseCase;
import io.github.gymates.auth.login.LoginUserCommand;
import io.github.gymates.auth.login.LoginUserUseCase;
import io.github.gymates.auth.login.TokenData;
import io.github.gymates.auth.login.TokenService;
import io.github.gymates.auth.register.RegisterUserCommand;
import io.github.gymates.auth.register.RegisterUserUseCase;
import io.github.gymates.user.model.User;
import io.github.gymates.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService implements RegisterUserUseCase,
  LoginUserUseCase,
  ResendVerificationCodeUseCase,
  SendVerificationCodeUseCase,
  VerifyUserUseCase
{
  private final UserRepository userRepository;
  private final EmailService emailService;
  private final AuthenticationManager authenticationManager;
  private final TokenService tokenService;

  @Override
  public TokenData loginUser(LoginUserCommand command) {
    User user = userRepository.findByEmail(command.email())
      .orElseThrow(() -> new RuntimeException("User not found"));

    if (!user.isEnabled()) {
      throw new RuntimeException("Account not verified. Please verify your");
    }

    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(command.email(), command.password()));

    String token = tokenService.generateToken(user);

    return TokenData.builder()
      .token(token)
      .expirationTime(tokenService.getExpirationTime())
      .build();
  }

  @Override
  @Transactional
  public User registerUser(RegisterUserCommand command) {
    User user = User.builder()
      .email(command.email())
      .username(command.username())
      .password(command.password())
      .verificationCode(generateVerificationCode())
      .expirationDate(LocalDateTime.now().plusMinutes(15))
      .isEnabled(false)
      .build();

    User savedUser = userRepository.save(user);
    sendVerificationCode(new SendVerificationCodeCommand(savedUser));

    return savedUser;
  }

  @Override
  public void resendVerificationCode(ResendVerificationCodeCommand command) {
    Optional<User> optionalUser = userRepository.findByEmail(command.email());

    if (optionalUser.isPresent()) {
      User user = optionalUser.get();
      if (user.isEnabled()) {
        throw new RuntimeException("Account is already verified");
      }
      user.setVerificationCode(generateVerificationCode());
      user.setExpirationDate(LocalDateTime.now().plusHours(1));

      userRepository.save(user);
      sendVerificationCode(new SendVerificationCodeCommand(user));
    } else {
      throw new RuntimeException("User not found");
    }
  }

  @Override
  public void sendVerificationCode(SendVerificationCodeCommand command) {
    String subject = "Account Verification";
    String verificationCode = "VERIFICATION CODE " + command.user().getVerificationCode();
    String htmlMessage = "<html>"
      + "<body style=\"font-family: Arial, sans-serif;\">"
      + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
      + "<h2 style=\"color: #333;\">Welcome to our app!</h2>"
      + "<p style=\"font-size: 16px;\">Please enter the verification code below to continue:</p>"
      + "<div style=\"background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
      + "<h3 style=\"color: #333;\">Verification Code:</h3>"
      + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
      + "</div>"
      + "</div>"
      + "</body>"
      + "</html>";

    emailService.sendEmail(command.user().getEmail(), subject, htmlMessage);
  }

  @Override
  public void verifyUser(VerifyUserCommand command) {
    Optional<User> optionalUser = userRepository.findByEmail(command.user().getEmail());

    if(optionalUser.isPresent()) {
      User user = optionalUser.get();
      if (user.getExpirationDate().isBefore(LocalDateTime.now())) {
        throw new RuntimeException("Verification code has expired");
      }
      if (user.getVerificationCode().equals(command.user().getVerificationCode())) {
        user.setEnabled(true);
        user.setVerificationCode(null);
        user.setExpirationDate(null);
        userRepository.save(user);
      } else {
        throw new RuntimeException("Codes do not match");
      }
    } else {
      throw new RuntimeException("User does not exist");
    }
  }

  private String generateVerificationCode() {
    Random random = new Random();
    int code = random.nextInt(900000) + 100000;
    return String.valueOf(code);
  }
}
