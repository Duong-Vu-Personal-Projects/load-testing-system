package com.vn.ptit.duongvct.service.impl;

import com.vn.ptit.duongvct.domain.User;
import com.vn.ptit.duongvct.dto.request.auth.RequestRegisterDTO;
import com.vn.ptit.duongvct.dto.response.auth.ResponseRegisterDTO;
import com.vn.ptit.duongvct.repository.mongo.UserMongoRepository;
import com.vn.ptit.duongvct.repository.search.UserSearchRepository;
import com.vn.ptit.duongvct.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.Optional;
@Service
public class UserServiceImpl implements UserService {
    private final UserMongoRepository userMongoRepository;
    private final UserSearchRepository userSearchRepository;
    private final ModelMapper mapper;
    public UserServiceImpl(UserMongoRepository userMongoRepository, UserSearchRepository userSearchRepository, ModelMapper mapper) {
        this.userMongoRepository = userMongoRepository;
        this.userSearchRepository = userSearchRepository;
        this.mapper = mapper;
    }
    @Override
    public Optional<User> findByUsername(String username) {
        Optional<User> optionalUser = userMongoRepository.findByUsername(username);
        return optionalUser;
    }


    @Override
    public User createUser(User user) {
        if (userMongoRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists. Please choose another email");
        }
        if (userMongoRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists. Please choose another username");
        }
        user.setRole("USER");
        return userMongoRepository.save(user);
    }

    @Override
    public boolean isEmailExists(String email) {
        return userMongoRepository.existsByEmail(email);
    }

    @Override
    public User mapRequestRegisterDTO(RequestRegisterDTO dto) {
        return mapper.map(dto, User.class);
    }

    @Override
    public ResponseRegisterDTO mapUser(User user) {
        return mapper.map(user, ResponseRegisterDTO.class);
    }
    @Override
    public void updateUserToken(String token, String username) {
        Optional<User> currentUser = this.findByUsername(username);
        if (currentUser.isPresent()) {
            currentUser.get().setRefreshToken(token);
            this.userMongoRepository.save(currentUser.get());
        }
    }

    @Override
    public User getUserByRefreshTokenAndUsername(String refreshToken, String username) {
        return this.userMongoRepository.findByRefreshTokenAndUsername(refreshToken, username).get();
    }
}
