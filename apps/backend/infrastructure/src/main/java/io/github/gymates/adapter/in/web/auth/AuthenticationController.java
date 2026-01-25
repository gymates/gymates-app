package io.github.gymates.adapter.in.web.auth;

import io.github.gymates.adapter.in.web.auth.dto.*;
import io.github.gymates.adapter.out.jwt.JwtService;
import io.github.gymates.auth.email.ResendVerificationCodeCommand;
import io.github.gymates.auth.email.ResendVerificationCodeUseCase;
import io.github.gymates.auth.email.VerifyUserCommand;
import io.github.gymates.auth.email.VerifyUserUseCase;
import io.github.gymates.user.model.User;
import io.github.gymates.auth.login.TokenData;
import io.github.gymates.auth.login.LoginUserCommand;
import io.github.gymates.auth.login.LoginUserUseCase;
import io.github.gymates.auth.register.RegisterUserCommand;
import io.github.gymates.auth.register.RegisterUserUseCase;
import io.github.gymates.adapter.in.web.auth.mappers.AuthResponseMapper;
import io.github.gymates.user.model.VerificationUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
  private final JwtService jwtService;
  private final RegisterUserUseCase registerUserUseCase;
  private final LoginUserUseCase loginUserUseCase;
  private final VerifyUserUseCase verifyUserUseCase;
  private final ResendVerificationCodeUseCase resendVerificationCodeUseCase;
  private final AuthResponseMapper authResponseMapper;

  @PostMapping("/register")
  public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
    RegisterUserCommand command = new RegisterUserCommand(request.getUsername(), request.getEmail(), request.getPassword());

    User registeredUser = registerUserUseCase.registerUser(command);

    return ResponseEntity.ok(authResponseMapper.toRegisterResponse(registeredUser));
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
    LoginUserCommand command = new LoginUserCommand(request.getEmail(), request.getPassword());

    TokenData tokenData = loginUserUseCase.loginUser(command);

    return ResponseEntity.ok(authResponseMapper.toLoginResponse(tokenData));
  }

  @PostMapping("/verify")
  public ResponseEntity<?> verifyUser(@RequestBody VerifyUserRequest request) {
    try {
      VerifyUserCommand command = new VerifyUserCommand(VerificationUser.builder()
              .email(request.getEmail())
              .verificationCode(request.getVerificationCode())
              .build());
      verifyUserUseCase.verifyUser(command);
      return ResponseEntity.ok("Account verified successfully.");
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PostMapping("/resend")
  public ResponseEntity<?> resendVerification(@RequestParam String email) {
    try {
      ResendVerificationCodeCommand command = new ResendVerificationCodeCommand(email);
      resendVerificationCodeUseCase.resendVerificationCode(command);
      return ResponseEntity.ok("Verification code sent");
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}
