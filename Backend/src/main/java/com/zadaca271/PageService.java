package com.zadaca271;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PageService<T> {
    Page<T> findAll(Pageable pageable, String searchText);
    Page<T> findAll(Pageable pageable);
}
