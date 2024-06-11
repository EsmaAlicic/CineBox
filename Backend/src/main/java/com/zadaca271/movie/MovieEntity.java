package com.zadaca271.movie;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.zadaca271.comment.CommentEntity;
import com.zadaca271.user.UserEntity;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;

@Entity
@Data
@Table(name = "movies")
public class MovieEntity {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String genre;

    @Column(nullable = false)
    private String thumbnail;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Date date;

    @Column(nullable = false)
    private String releaseYear;

    @Column(nullable = false)
    private Boolean featured = true;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = true)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("users")
    private UserEntity postedBy;

    @OneToMany(targetEntity = CommentEntity.class, mappedBy = "relatedTo", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonIgnoreProperties("comments")
    private Collection<CommentEntity> comments;
}
