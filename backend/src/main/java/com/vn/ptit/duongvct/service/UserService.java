package com.vn.ptit.duongvct.service;

import com.vn.ptit.duongvct.domain.User;
import com.vn.ptit.duongvct.dto.request.auth.RequestRegisterDTO;
import com.vn.ptit.duongvct.dto.response.auth.ResponseRegisterDTO;

import java.util.Optional;

public interface UserService {
    public Optional<User> findByUsername(String username);
    public User createUser(User user);
    public boolean isEmailExists(String email);
    public User mapRequestRegisterDTO(RequestRegisterDTO dto);
    public ResponseRegisterDTO mapUser(User user);
    public void updateUserToken(String token, String username);
    public User getUserByRefreshTokenAndUsername(String refreshToken, String username);

}
