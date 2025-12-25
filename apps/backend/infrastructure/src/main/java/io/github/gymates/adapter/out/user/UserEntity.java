package io.github.gymates.adapter.out.user;

import io.github.gymates.user.model.Role;
import io.github.gymates.user.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class UserEntity implements UserDetails {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO) // It is by default
  private Integer id;
  @Column(unique = true, nullable = false)
  private String username;
  @Column(unique = true, nullable = false)
  private String email;
  private String firstName;
  private String lastName;
  @Column(nullable = false)
  private String password;
  @Enumerated(EnumType.STRING)
  private Role role;
  private boolean enabled;
  @Column(name = "verification_code")
  private String verificationCode;
  @Column(name = "verificationExpiration")
  private LocalDateTime verificationExpiration;

  public UserEntity(String username, String email, String password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority(role.name()));
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

static UserEntity fromUser(User user) {
    return UserEntity.builder()
      .email(user.getEmail())
      .id(user.getId())
      .password(user.getPassword())
      .enabled(user.isEnabled())
      .firstName(user.getFirstName())
      .lastName(user.getLastName())
      .username(user.getUsername())
      .role(user.getRole())
      .verificationCode(user.getVerificationCode())
      .verificationExpiration(user.getExpirationDate())
      .build();
}

User toUser() {
    return User.builder()
      .id(id)
      .email(email)
      .verificationCode(verificationCode)
      .expirationDate(verificationExpiration)
      .firstName(firstName)
      .lastName(lastName)
      .role(role)
      .isEnabled(enabled)
      .password(password)
      .username(username)
      .build();
}
}
