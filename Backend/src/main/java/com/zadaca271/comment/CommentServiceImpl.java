package com.zadaca271.comment;

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
public class CommentServiceImpl implements EntityService<CommentEntity>, PageService<CommentEntity> {

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public Collection<CommentEntity> findAll() { return commentRepository.findAll(); }

    public Collection<CommentEntity> findAllByPost(String movieId) { return commentRepository.findAllByPost(movieId); }

    @Override
    public Page<CommentEntity> findAll(Pageable pageable, String searchText) {
        return null;
    }

    @Override
    public Page<CommentEntity> findAll(Pageable pageable) {
        return commentRepository.findAll(pageable);
    }

    @Override
    public Optional<CommentEntity> findById(String id) {
        return commentRepository.findById(id);
    }

    @Override
    public CommentEntity saveOrUpdate(CommentEntity comment) {
        return commentRepository.save(comment);
    }

    @Override
    public String deleteById(String id) {
        JSONObject jsonObject = new JSONObject();
        try {
            commentRepository.deleteById(id);
            jsonObject.put("message", "Comment deleted successfully");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject.toString();
    }
}
