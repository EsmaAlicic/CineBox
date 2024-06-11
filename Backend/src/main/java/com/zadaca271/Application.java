package com.zadaca271;

import com.zadaca271.comment.CommentEntity;
import com.zadaca271.comment.CommentServiceImpl;
import com.zadaca271.movie.MovieEntity;
import com.zadaca271.movie.MovieServiceImpl;
import com.zadaca271.role.RoleConstant;
import com.zadaca271.role.RoleEntity;
import com.zadaca271.role.RoleServiceImpl;
import com.zadaca271.user.UserEntity;
import com.zadaca271.user.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;
import java.sql.Date;

@SpringBootApplication
@EnableSwagger2
public class Application implements CommandLineRunner {

	@Autowired
	private UserServiceImpl userService;

	@Autowired
	private RoleServiceImpl roleService;

	@Autowired
	private MovieServiceImpl movieService;

	@Autowired
	private CommentServiceImpl commentService;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	public Docket productApi() {
		return new Docket(DocumentationType.SWAGGER_2)
				.select().apis(RequestHandlerSelectors.basePackage("com.zadaca271"))
				.build();
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("*")
						.allowedMethods("HEAD", "OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE");
			}
		};
	}

	@Override
	public void run(String... args) throws Exception {
		if (roleService.findAll().isEmpty()) {
			roleService.saveOrUpdate(new RoleEntity(RoleConstant.ADMIN.toString()));
			roleService.saveOrUpdate(new RoleEntity(RoleConstant.USER.toString()));
			roleService.saveOrUpdate(new RoleEntity(RoleConstant.GUEST.toString()));
		}
		if (userService.findAll().isEmpty()) {
			UserEntity newAdmin = new UserEntity();
			newAdmin.setEmail("wp@admin.com");
			newAdmin.setName("Admin");
			newAdmin.setSurname("Admin");
			newAdmin.setRole(roleService.findByName(RoleConstant.ADMIN.toString()));
			newAdmin.setPassword(new BCryptPasswordEncoder().encode("admin123"));
			userService.saveOrUpdate(newAdmin);

			UserEntity newUser1 = new UserEntity();
			newUser1.setEmail("wp@user1.com");
			newUser1.setName("User");
			newUser1.setSurname("One");
			newUser1.setRole(roleService.findByName(RoleConstant.USER.toString()));
			newUser1.setPassword(new BCryptPasswordEncoder().encode("user123"));
			userService.saveOrUpdate(newUser1);

			UserEntity newUser2 = new UserEntity();
			newUser2.setEmail("wp@user2.com");
			newUser2.setName("User");
			newUser2.setSurname("Two");
			newUser2.setRole(roleService.findByName(RoleConstant.USER.toString()));
			newUser2.setPassword(new BCryptPasswordEncoder().encode("user123"));
			userService.saveOrUpdate(newUser2);

			UserEntity newUser3 = new UserEntity();
			newUser3.setEmail("wp@user3.com");
			newUser3.setName("User");
			newUser3.setSurname("Three");
			newUser3.setRole(roleService.findByName(RoleConstant.USER.toString()));
			newUser3.setPassword(new BCryptPasswordEncoder().encode("user123"));
			userService.saveOrUpdate(newUser3);

			UserEntity guest = new UserEntity();
			guest.setEmail("wp@guest.com");
			guest.setName("Guest");
			guest.setSurname("Guest");
			guest.setRole(roleService.findByName(RoleConstant.GUEST.toString()));
			guest.setPassword(new BCryptPasswordEncoder().encode("guest123"));
			userService.saveOrUpdate(guest);
		}
		if(movieService.findAll().isEmpty()) {
			MovieEntity movie1 = new MovieEntity();
			movie1.setTitle("Inception");
			movie1.setDescription("A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.");
			movie1.setDate(Date.valueOf("2024-10-14"));
			movie1.setThumbnail("https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg");
			movie1.setGenre("Action, Adventure, Sci-Fi");
			movie1.setReleaseYear("2010");
			movie1.setFeatured(true);
			movie1.setPostedBy(userService.findByEmail("wp@admin.com"));
			movieService.saveOrUpdate(movie1);

			MovieEntity movie2 = new MovieEntity();
			movie2.setTitle("Tenet");
			movie2.setDescription("Armed with only the word Tenet, and fighting for the survival of the entire world, CIA operative, The Protagonist, journeys through a twilight world of international espionage on a global mission that unfolds beyond real time.");
			movie2.setDate(Date.valueOf("2023-12-12"));
			movie2.setThumbnail("https://m.media-amazon.com/images/M/MV5BMzU3YWYwNTQtZTdiMC00NjY5LTlmMTMtZDFlYTEyODBjMTk5XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg");
			movie2.setGenre("Action, Sci-Fi, Thriller");
			movie2.setReleaseYear("2020");
			movie2.setFeatured(true);
			movie2.setPostedBy(userService.findByEmail("wp@admin.com"));
			movieService.saveOrUpdate(movie2);

			MovieEntity movie3 = new MovieEntity();
			movie3.setTitle("Interstellar");
			movie3.setDescription("When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.");
			movie3.setDate(Date.valueOf("2023-12-14"));
			movie3.setThumbnail("https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg");
			movie3.setGenre("Adventure, Drama, Sci-Fi");
			movie3.setReleaseYear("2014");
			movie3.setFeatured(true);
			movie3.setPostedBy(userService.findByEmail("wp@admin.com"));
			movieService.saveOrUpdate(movie3);

			CommentEntity newComment1 = new CommentEntity();
			newComment1.setContent("Amongst the best movies of all time. The story, the acting, the script, the cinematography, the effects, the sound and the production as a whole is all absolute 10/10's.");
			newComment1.setRelatedTo(movie1);
			newComment1.setPostedBy(userService.findByEmail("wp@user1.com"));
			newComment1.setDate(Date.valueOf("2023-12-12"));
			commentService.saveOrUpdate(newComment1);

			CommentEntity newComment2 = new CommentEntity();
			newComment2.setContent("There is not even a single day I don't think of this movie, it's scenes , it has a profound impact on me and it shall remain with me forever.");
			newComment2.setRelatedTo(movie1);
			newComment2.setPostedBy(userService.findByEmail("wp@user2.com"));
			newComment2.setDate(Date.valueOf("2023-12-13"));
			commentService.saveOrUpdate(newComment2);

			CommentEntity newComment3 = new CommentEntity();
			newComment3.setContent("Christopher Nolan? The man who keeps delivering..");
			newComment3.setRelatedTo(movie2);
			newComment3.setPostedBy(userService.findByEmail("wp@user3.com"));
			newComment3.setDate(Date.valueOf("2023-12-13"));
			commentService.saveOrUpdate(newComment3);
		}
	}
}
