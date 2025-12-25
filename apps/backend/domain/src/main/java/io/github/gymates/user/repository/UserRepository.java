package io.github.gymates.user.repository;

import io.github.gymates.user.model.User;

import java.util.Optional;

public interface UserRepository {
  User save(User user);
  Optional<User> findByEmail(String email);
  Optional<User> findByUsername(String username);
 }
