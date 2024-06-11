package com.zadaca271.user;

import com.zadaca271.EntityService;
import com.zadaca271.PageService;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.Collection;
import java.util.Optional;

@Service
public class UserServiceImpl implements EntityService<UserEntity>, PageService<UserEntity> {

    @Autowired
    private UserRepository userRepository;

    @Override
    public Collection<UserEntity> findAll() { return userRepository.findAll(); }

    @Override
    public Page<UserEntity> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    public Page<UserEntity> findAll(Pageable pageable, String searchText) { return userRepository.findAllUsers(pageable, searchText); }

    @Override
    public Optional<UserEntity> findById(String id) {
        return userRepository.findById(id);
    }

    public UserEntity findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public UserEntity saveOrUpdate(UserEntity user) {
        return userRepository.save(user);
    }

    @Override
    public String deleteById(String id) {
        JSONObject jsonObject = new JSONObject();
        try {
            userRepository.deleteById(id);
            jsonObject.put("message", "User deleted successfully");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject.toString();
    }
}