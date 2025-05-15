package com.vn.ptit.duongvct.domain;


import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "users")
@org.springframework.data.elasticsearch.annotations.Document(indexName = "users")
@Getter
@Setter
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String role;

    private Instant createdAt;
    private Instant lastModifiedAt;

    
}
