package io.github.gymates.adapter.out.user;

import io.github.gymates.user.model.User;
import io.github.gymates.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.Repository;

import java.util.Optional;

interface SqlUserRepository extends Repository<UserEntity, Integer> {
  UserEntity save(UserEntity user);
  Optional<UserEntity> findByEmail(String email);
  Optional<UserEntity> findByUsername(String username);
}


@org.springframework.stereotype.Repository
@RequiredArgsConstructor
class SqlUserRepositoryImpl implements UserRepository {
  private final SqlUserRepository sqlUserRepository;

  @Override
  public User save(User user) {
    return sqlUserRepository.save(UserEntity.fromUser(user)).toUser();
  }

  @Override
  public Optional<User> findByEmail(String email) {
    return sqlUserRepository.findByEmail(email)
      .map(UserEntity::toUser);
  }

  @Override
  public Optional<User> findByUsername(String username) {
    return sqlUserRepository.findByUsername(username)
      .map(UserEntity::toUser);
  }
}
