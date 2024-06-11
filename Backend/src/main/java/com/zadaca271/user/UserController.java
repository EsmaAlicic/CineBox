package com.zadaca271.user;

import com.zadaca271.auth.JwtTokenProvider;
import com.zadaca271.role.RoleConstant;
import com.zadaca271.role.RoleServiceImpl;
import io.swagger.annotations.ApiImplicitParam;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Collection;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private static Logger log = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private RoleServiceImpl roleService;

    @Autowired
    private UserServiceImpl userService;

    @GetMapping("/get-all-users")
    @ApiImplicitParam(name = "Authorization", value = "Access Token", required = true, paramType = "header", example = "Bearer access_token")
    public ResponseEntity<Collection<UserEntity>> fetchAllUsers() {
        log.info("UserServiceImpl : get all users");
        JSONObject jsonObject = new JSONObject();
        try {
            String currentUsersEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            if(userService.findByEmail(currentUsersEmail).getRole() == roleService.findByName("ADMIN")) {
                return new ResponseEntity<>(userService.findAll(), HttpStatus.OK);
            }
            throw new JSONException("User " + currentUsersEmail + " failed to fetch all Users from the database, because he does not have the permission to do so.");
        } catch (JSONException e) {
            try {
                jsonObject.put("exception", e.getMessage());
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/get-current-user")
    @ApiImplicitParam(name = "Authorization", value = "Access Token", required = true, paramType = "header", example = "Bearer access_token")
    public ResponseEntity<UserEntity> findCurrentUser() {
        log.info("UserServiceImpl : get current user");
        JSONObject jsonObject = new JSONObject();
        try {
            String currentUsersEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            UserEntity currentUser = userService.findByEmail(currentUsersEmail);
            if(currentUser != null) {
                return new ResponseEntity<>(currentUser, HttpStatus.OK);
            }
            throw new JSONException("User " + currentUsersEmail + " was not found in the database.");
        } catch (JSONException e) {
            try {
                jsonObject.put("exception", e.getMessage());
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping(value = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> register(@RequestBody UserEntity user) {
        log.info("UserServiceImpl : register a user");
        JSONObject jsonObject = new JSONObject();
        try {
            user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
            user.setRole(roleService.findByName(RoleConstant.USER.toString()));
            UserEntity savedUser = userService.saveOrUpdate(user);
            String responseMessage = "User " + savedUser.getEmail() + " successfully registered on RokPay.";
            jsonObject.put("message", responseMessage);
            return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
        } catch (JSONException e) {
            try {
                jsonObject.put("exception", e.getMessage());
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
            return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping(value = "/authenticate", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> authenticate(@RequestBody UserEntity user) {
        log.info("UserServiceImpl : authenticate a user");
        JSONObject jsonObject = new JSONObject();
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
            if (authentication.isAuthenticated()) {
                if(userService.findByEmail(user.getEmail()).getActive()) {
                    String email = user.getEmail();
                    UserEntity loggedInUser = userService.findByEmail(email);
                    jsonObject.put("name", email);
                    jsonObject.put("role", loggedInUser.getRole().getName());
                    jsonObject.put("token", tokenProvider.createToken(email, loggedInUser.getRole()));
                    return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.OK);
                } throw new JSONException("User is not active!");
            }
            throw new JSONException("Incorrect credentials!");
        } catch (JSONException e) {
            try {
                jsonObject.put("exception", e.getMessage());
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
            return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping(value = "/update-user", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = "Authorization", value = "Access Token", required = true, paramType = "header", example = "Bearer access_token")
    public ResponseEntity<String> update(@RequestBody UserEntity user) {
        log.info("UserServiceImpl : update a user");
        JSONObject jsonObject = new JSONObject();
        try {
            String currentUsersEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            UserEntity userToBeUpdated = userService.findById(user.getId()).get();
            if(userService.findByEmail(currentUsersEmail).getRole() == roleService.findByName("ADMIN") || userToBeUpdated.getEmail().equals(currentUsersEmail)) {
                user.setEmail(userToBeUpdated.getEmail());
                user.setPassword(userToBeUpdated.getPassword());
                user.setRole(userToBeUpdated.getRole());
                user.setCreatedAt(userToBeUpdated.getCreatedAt());
                user.setUpdatedAt(LocalDateTime.now());
                if(user.getName() == null) user.setName(userToBeUpdated.getName());
                if(user.getSurname() == null) user.setSurname(userToBeUpdated.getSurname());
                if(user.getActive() == null) user.setActive(userToBeUpdated.getActive());
                userService.saveOrUpdate(user);
                String responseMessage = "User " + currentUsersEmail + " successfully updated his personal information on RokPay.";
                jsonObject.put("message", responseMessage);
                return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
            }
            throw new JSONException("User " + currentUsersEmail + " is not authorized to update other users.");
        } catch (JSONException e) {
            try {
                jsonObject.put("exception", e.getMessage());
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
            return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/change-current-users-password/{oldPassword}/{newPassword}")
    @ApiImplicitParam(name = "Authorization", value = "Access Token", required = true, paramType = "header", example = "Bearer access_token")
    public ResponseEntity<String> changeUsersPassword(@PathVariable String oldPassword, @PathVariable String newPassword) {
        log.info("UserServiceImpl : change of the user's password");
        JSONObject jsonObject = new JSONObject();
        try {
            String currentUsersEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            UserEntity userToBeUpdated = userService.findByEmail(currentUsersEmail);
            if(userToBeUpdated != null) {
                Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userToBeUpdated.getEmail(), oldPassword));
                if (authentication.isAuthenticated()) {
                    userToBeUpdated.setPassword(new BCryptPasswordEncoder().encode(newPassword));
                    userService.saveOrUpdate(userToBeUpdated);
                    jsonObject.put("message", "User " + currentUsersEmail + " successfully changed his password.");
                    return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
                }
                throw new JSONException("User " + currentUsersEmail + " failed to update his password, because he entered an incorrect old password.");
            }
            throw new JSONException("User "  + currentUsersEmail +  " could not change his password, because the user does not exist in the database.");
        } catch (JSONException e) {
            try {
                jsonObject.put("exception", e.getMessage());
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
            return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping(value = "/activate-user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = "Authorization", value = "Access Token", required = true, paramType = "header", example = "Bearer access_token")
    public ResponseEntity<String> activateUser(@PathVariable String userId) {
        log.info("UserServiceImpl : activate a user");
        JSONObject jsonObject = new JSONObject();
        try {
            if(userService.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).getRole() == roleService.findByName("ADMIN")) {
                UserEntity userToBeUpdated = userService.findById(userId).get();
                userToBeUpdated.setActive(true);
                userService.saveOrUpdate(userToBeUpdated);
                jsonObject.put("message", "User successfully activated.");
                return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
            }
            throw new JSONException("User could not be activated, because the user who is sending the request is not authorized to do so.");
        } catch (JSONException e) {
            try {
                jsonObject.put("exception", e.getMessage());
            } catch (JSONException e1) {
                e1.printStackTrace();
            }
            return new ResponseEntity<String>(jsonObject.toString(), HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping(value = "/deactivate-user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParam(name = "Authorization", value = "Access Token", required = true, paramType = "header", example = "Bearer access_token")
    public ResponseEntity<String> deactivateUser(@PathVariable String userId) {
        log.info("UserServiceImpl : deactivate a user");
        JSONObject jsonObject = new JSONObject();
        try {
            if(userService.findByEmail(SecurityContextHolder.getContext().getAuthentication().getName()).getRole() == roleService.findByName("ADMIN")) {
                UserEntity userToBeUpdated = userService.findById(userId).get();
                userToBeUpdated.setActive(false);
                userService.saveOrUpdate(userToBeUpdated);
                jsonObject.put("message", "User successfully deactivated.");
                return new ResponseEntity<>(jsonObject.toString(), HttpStatus.OK);
            }
            throw new JSONException("User could not be deactivated, because the user who is sending the request is not authorized to do so.");
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
