package com.vn.ptit.duongvct.config.mongo;

import com.vn.ptit.duongvct.domain.User;
import com.vn.ptit.duongvct.util.SecurityUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class UserMongoEventListener extends AbstractMongoEventListener<User> {
    private static final Logger log = LoggerFactory.getLogger(UserMongoEventListener.class);
    @Override
    public void onBeforeConvert(BeforeConvertEvent<User> event) {
        super.onBeforeConvert(event);
        User user = event.getSource();
        String currentUsername = SecurityUtil.getCurrentUserLogin()
                .orElse("system");
        Instant now = Instant.now();
        try {
            if (user.getId() == null || user.getCreatedAt() == null) {
                user.setCreatedAt(now);
                user.setCreatedBy(currentUsername);
            }

            user.setLastModifiedAt(now);
            user.setLastModifiedBy(currentUsername);

        } catch (Exception e) {
            log.error("Error in UserMongoEventListener.onBeforeConvert: {}", e.getMessage(), e);
        }

    }
}
