package com.zadaca271.role;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Collection;

@Repository
public interface RoleRepository extends PagingAndSortingRepository<RoleEntity, String> {
    @Query("FROM RoleEntity WHERE name=:name")
    RoleEntity findByName(@Param("name") String name);

    @Query("FROM RoleEntity")
    Collection<RoleEntity> findAll();

    @Query("FROM RoleEntity role WHERE role.name LIKE %:searchText%")
    Page<RoleEntity> findAllRoles(Pageable pageable, @Param("searchText") String searchText);
}
