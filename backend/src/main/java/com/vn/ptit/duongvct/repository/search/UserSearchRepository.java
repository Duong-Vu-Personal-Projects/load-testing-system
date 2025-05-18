package com.vn.ptit.duongvct.repository.search;

import com.vn.ptit.duongvct.domain.User;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository(value = "userSearchRepository")
public interface UserSearchRepository extends ElasticsearchRepository<User, String> {
    
}