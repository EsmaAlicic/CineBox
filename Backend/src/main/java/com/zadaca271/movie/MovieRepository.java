package com.zadaca271.movie;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import java.util.Collection;

public interface MovieRepository extends PagingAndSortingRepository<MovieEntity, String> {
    @Query("FROM MovieEntity")
    Collection<MovieEntity> findAll();
}
