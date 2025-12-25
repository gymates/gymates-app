package io.github.gymates.adapter.in.web.auth;

import io.github.gymates.adapter.out.jwt.JwtService;
import io.github.gymates.user.model.User;
import io.github.gymates.auth.login.TokenData;
import io.github.gymates.auth.login.LoginUserCommand;
import io.github.gymates.auth.login.LoginUserUseCase;
import io.github.gymates.auth.register.RegisterUserCommand;
import io.github.gymates.auth.register.RegisterUserUseCase;
import io.github.gymates.adapter.in.web.auth.dto.LoginRequest;
import io.github.gymates.adapter.in.web.auth.dto.LoginResponse;
import io.github.gymates.adapter.in.web.auth.dto.RegisterRequest;
import io.github.gymates.adapter.in.web.auth.dto.RegisterResponse;
import io.github.gymates.adapter.in.web.auth.mappers.AuthResponseMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
  private final JwtService jwtService;
  private final RegisterUserUseCase registerUserUseCase;
  private final LoginUserUseCase loginUserUseCase;
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
}
