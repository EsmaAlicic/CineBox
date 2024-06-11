package com.zadaca271.comment;

import com.zadaca271.movie.MovieController;
import com.zadaca271.movie.MovieServiceImpl;
import com.zadaca271.role.RoleServiceImpl;
import com.zadaca271.user.UserServiceImpl;
import io.swagger.annotations.ApiImplicitParam;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comment")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {
    private static Logger log = LoggerFactory.getLogger(MovieController.class);

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private RoleServiceImpl roleService;

    @Autowired
    private MovieServiceImpl movieService;

    @Autowired
    private CommentServiceImpl commentService;

    @PostMapping("/add-comment/{movieId}")
    @ApiImplicitParam(name = "Authorization", value = "Access Token", required = true, paramType = "header", example = "Bearer access_token")
    public ResponseEntity<CommentEntity> addComment(@RequestBody CommentEntity commentEntity, @PathVariable String movieId) {
        log.info("CommentServiceImpl : add comment");
        commentEntity.setPostedBy(userService.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()));
        commentEntity.setRelatedTo(movieService.findById(movieId).get());
        return new ResponseEntity<>(commentService.saveOrUpdate(commentEntity), HttpStatus.OK);
    }

    @DeleteMapping("/delete-comment/{commentId}")
    @ApiImplicitParam(name = "Authorization", value = "Access Token", required = true, paramType = "header", example = "Bearer access_token")
    public ResponseEntity<String> deleteComment(@PathVariable String commentId) {
        log.info("CommentServiceImpl : delete a comment");
        JSONObject jsonObject = new JSONObject();
        try {
            if(userService.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).getRole() == roleService.findByName("ADMIN")) {
                jsonObject.put("message", "Comment deleted successfully.");
                commentService.deleteById(commentId);
                return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.OK);
            } throw new JSONException("Failed to delete the comment, because the current user does not have the permission to do so.");
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
