package com.zadaca271;

import java.util.Collection;
import java.util.Optional;

public interface EntityService<T> {
    Collection<T> findAll();

    Optional<T> findById(String id);

    T saveOrUpdate(T t);

    String deleteById(String id);
}