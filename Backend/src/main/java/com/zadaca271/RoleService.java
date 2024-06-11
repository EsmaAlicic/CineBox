package com.zadaca271;

public interface RoleService<T> extends EntityService<T> {
    T findByName(String name);
}
