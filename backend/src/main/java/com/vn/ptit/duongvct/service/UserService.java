package com.vn.ptit.duongvct.service;

import com.vn.ptit.duongvct.domain.User;
import com.vn.ptit.duongvct.repository.mongo.UserMongoRepository;
import com.vn.ptit.duongvct.repository.search.UserSearchRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserMongoRepository userMongoRepository;
    private final UserSearchRepository userSearchRepository;

    public UserService(UserMongoRepository userMongoRepository, UserSearchRepository userSearchRepository) {
        this.userMongoRepository = userMongoRepository;
        this.userSearchRepository = userSearchRepository;
    }
    public Optional<User> findByUsername(String username) {
        return userMongoRepository.findByUsername(username);
    }
}
