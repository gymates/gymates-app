package io.github.gymates.auth.login;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class TokenData {
  private String token;
  private Long expirationTime;
}
