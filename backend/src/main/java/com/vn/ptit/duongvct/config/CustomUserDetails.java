package com.vn.ptit.duongvct.config;

import com.vn.ptit.duongvct.domain.User;
import com.vn.ptit.duongvct.service.UserService;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Optional;
@Component("userDetailsService")
public class CustomUserDetails implements UserDetailsService {
    private final UserService userService;

    public CustomUserDetails(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = this.userService.findByUsername(username);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("Incorrect username or password");
        }
        return new org.springframework.security.core.userdetails.User(
                user.get().getUsername(),
                user.get().getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
