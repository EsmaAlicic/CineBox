package com.zadaca271.movie;

import com.zadaca271.role.RoleServiceImpl;
import com.zadaca271.user.UserEntity;
import com.zadaca271.user.UserServiceImpl;
import io.swagger.annotations.ApiImplicitParam;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Collection;

@RestController
@RequestMapping("/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {
    private static Logger log = LoggerFactory.getLogger(MovieController.class);

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private RoleServiceImpl roleService;

    @Autowired
    private MovieServiceImpl movieService;

    @GetMapping("/get-all-movies")
    public ResponseEntity<Collection<MovieEntity>> fetchAllMovies() {
        log.info("MovieServiceImpl : get all movies");
        return new ResponseEntity<>(movieService.findAll(), HttpStatus.OK);
    }

    @PostMapping("/add-movie")
    @ApiImplicitParam(name = "Authorization", value = "Access Token", required = true, paramType = "header", example = "Bearer access_token")
    public ResponseEntity<MovieEntity> addMovie(@RequestBody MovieEntity movieEntity) {
        log.info("MovieServiceImpl : add movie");
        JSONObject jsonObject = new JSONObject();
        try {
            UserEntity currentUser = userService.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName());
            if(currentUser.getRole() == roleService.findByName("ADMIN")) {
                movieEntity.setPostedBy(currentUser);
                return new ResponseEntity<>(movieService.saveOrUpdate(movieEntity), HttpStatus.OK);
            }
            throw new JSONException("Failed to post a movie, because the current user does not have the permission to do so.");
        } catch (JSONException e) {
            try {
                jsonObject.put("exception", e.getMessage());
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping(value = "/update-movie", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = "Authorization", value = "Access Token", required = true, paramType = "header", example = "Bearer access_token")
    public ResponseEntity<String> updateMovie(@RequestBody MovieEntity movieEntity) {
        log.info("MovieServiceImpl : update movie");
        JSONObject jsonObject = new JSONObject();
        try {
            MovieEntity movieToBeUpdated = movieService.findById(movieEntity.getId()).get();
            if(userService.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).getRole() == roleService.findByName("ADMIN")) {
                if(movieEntity.getTitle() == null) movieEntity.setTitle(movieToBeUpdated.getTitle());
                if(movieEntity.getDescription() == null) movieEntity.setDescription(movieToBeUpdated.getDescription());
                if(movieEntity.getDate() == null) movieEntity.setDate(movieToBeUpdated.getDate());
                if(movieEntity.getFeatured() == null) movieEntity.setFeatured(movieToBeUpdated.getFeatured());
                movieEntity.setCreatedAt(movieToBeUpdated.getCreatedAt());
                movieEntity.setUpdatedAt(LocalDateTime.now());
                movieService.saveOrUpdate(movieEntity);
                jsonObject.put("message", "Movie successfully updated.");
                return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
            } throw new JSONException("Failed to update the movie, because the current user does not have the permission to do so.");
        } catch (JSONException e) {
            try {
                jsonObject.put("exception", e.getMessage());
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
            return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.UNAUTHORIZED);
        }
    }

    @DeleteMapping("/delete-movie/{movieId}")
    @ApiImplicitParam(name = "Authorization", value = "Access Token", required = true, paramType = "header", example = "Bearer access_token")
    public ResponseEntity<String> deleteMovie(@PathVariable String movieId) {
        log.info("MovieServiceImpl : delete movie");
        JSONObject jsonObject = new JSONObject();
        try {
            if(userService.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).getRole() == roleService.findByName("ADMIN")) {
                jsonObject.put("message", "Movie deleted successfully.");
                movieService.deleteById(movieId);
                return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.OK);
            } throw new JSONException("Failed to delete the movie, because the current user does not have the permission to do so.");
        } catch (JSONException e) {
            try {
                jsonObject.put("exception", e.getMessage());
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
            return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.UNAUTHORIZED);
        }
    }
}
