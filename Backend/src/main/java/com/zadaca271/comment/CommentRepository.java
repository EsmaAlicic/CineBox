package com.zadaca271.comment;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

import java.util.Collection;

public interface CommentRepository extends PagingAndSortingRepository<CommentEntity, String> {
    @Query("FROM CommentEntity")
    Collection<CommentEntity> findAll();

    @Query("FROM CommentEntity WHERE relatedTo.id=:movieId")
    Collection<CommentEntity> findAllByPost(@Param("movieId") String movieId);
}
