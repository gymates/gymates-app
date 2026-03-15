package io.github.gymates.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import io.github.gymates.user.model.User;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class DomainUserDetails implements UserDetails {

  private final User user;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority(user.getRole().name()));
  }

  @Override
  public String getPassword() {
    return user.getPassword();
  }

  /**
   * Returns the email address as the principal identifier.
   * Email is used consistently across the authentication flow:
   * UserDetailsService (findByEmail), authenticationManager, JWT subject, and JWT filter.
   */
  @Override
  public String getUsername() {
    return user.getEmail();
  }

  @Override
  public boolean isEnabled() {
    return user.isEnabled();
  }
}
