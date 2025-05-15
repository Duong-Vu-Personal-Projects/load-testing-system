package com.vn.ptit.duongvct.repository.mongo;

import com.vn.ptit.duongvct.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository(value = "userMongoRepository")
public interface UserMongoRepository extends MongoRepository<User, String> {
    public Optional<User> findByUsername(String username);
}
