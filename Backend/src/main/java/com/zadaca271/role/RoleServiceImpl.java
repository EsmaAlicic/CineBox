package com.zadaca271.role;

import com.zadaca271.PageService;
import com.zadaca271.RoleService;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.Collection;
import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService<RoleEntity>, PageService<RoleEntity> {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Collection<RoleEntity> findAll() { return roleRepository.findAll(); }

    @Override
    public Page<RoleEntity> findAll(Pageable pageable) {
        return roleRepository.findAll(pageable);
    }

    @Override
    public Page<RoleEntity> findAll(Pageable pageable, String searchText) { return roleRepository.findAllRoles(pageable, searchText); }

    @Override
    public Optional<RoleEntity> findById(String id) {
        return roleRepository.findById(id);
    }

    @Override
    public RoleEntity findByName(String name) {
        return roleRepository.findByName(name);
    }

    @Override
    public RoleEntity saveOrUpdate(RoleEntity role) {
        return roleRepository.save(role);
    }

    @Override
    public String deleteById(String id) {
        JSONObject jsonObject = new JSONObject();
        try {
            roleRepository.deleteById(id);
            jsonObject.put("message", "Role deleted successfully");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject.toString();
    }

}
