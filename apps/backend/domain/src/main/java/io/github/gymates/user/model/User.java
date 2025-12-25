package io.github.gymates.user.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
  private Integer id;
  private String firstName;
  private String lastName;
  private String username;
  private String email;
  private String password;
  private Role role;
  private String verificationCode;
  private LocalDateTime expirationDate;
  private boolean isEnabled;
}
