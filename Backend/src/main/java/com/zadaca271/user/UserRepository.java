package com.zadaca271.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Collection;

@Repository
public interface UserRepository extends PagingAndSortingRepository<UserEntity, String> {
    @Query("FROM UserEntity WHERE email=:email")
    UserEntity findByEmail(@Param("email") String email);

    @Query("FROM UserEntity")
    Collection<UserEntity> findAll();

    @Query("FROM UserEntity user WHERE user.name LIKE %:searchText% OR user.surname LIKE %:searchText% OR user.email LIKE %:searchText%")
    Page<UserEntity> findAllUsers(Pageable pageable, @Param("searchText") String searchText);
}
