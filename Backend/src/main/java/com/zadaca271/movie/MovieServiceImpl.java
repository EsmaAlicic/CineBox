package com.zadaca271.movie;

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
public class MovieServiceImpl implements EntityService<MovieEntity>, PageService<MovieEntity> {

    @Autowired
    private MovieRepository movieRepository;

    @Override
    public Collection<MovieEntity> findAll() { return movieRepository.findAll(); }

    @Override
    public Page<MovieEntity> findAll(Pageable pageable, String searchText) {
        return null;
    }

    @Override
    public Page<MovieEntity> findAll(Pageable pageable) {
        return movieRepository.findAll(pageable);
    }

    @Override
    public Optional<MovieEntity> findById(String id) {
        return movieRepository.findById(id);
    }

    @Override
    public MovieEntity saveOrUpdate(MovieEntity movie) {
        return movieRepository.save(movie);
    }

    @Override
    public String deleteById(String id) {
        JSONObject jsonObject = new JSONObject();
        try {
            movieRepository.deleteById(id);
            jsonObject.put("message", "Movie deleted successfully");
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject.toString();
    }
}