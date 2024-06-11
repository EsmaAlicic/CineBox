import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { GetCurrentUserAPI } from "../../services/UserService";
import {
  GetAllMoviesAPI,
  AddCommentAPI,
  DeleteCommentAPI,
} from "../../services/MoviesService";
import { useNavigate } from "react-router-dom";
import Sidebar from "../partials/sidebar/Sidebar";
import styles from "./dashboard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/actions/Actions";
import { Form, Modal, ListGroup } from "react-bootstrap";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

export default function DashboardPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [currentMovies, setCurrentMovies] = useState({
    title: "",
    date: "",
    comments: [],
    description: "",
    thumbnail: "",
    genre: "",
    releaseYear: "",
  });
  const [currentCommentContent, setCurrentCommentContent] = useState("");
  const [showMoviesModal, setShowMoviesModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    surname: "",
    role: {
      name: "",
    },
  });
  const dispatch = useDispatch();
  const info = useSelector((state) => {
    return state.authenticateToken;
  });

  async function fetchMyAPI() {
    await GetCurrentUserAPI(info.authenticateInfo.token).then((res) => {
      setCurrentUser(res);
      dispatch(setUser(res));
    });
  }

  async function fetchAllMovies() {
    await GetAllMoviesAPI(info.authenticateInfo.token).then((res) => {
      setMovies(res);
      console.log(res);
      res.forEach((moviesInstance) => {
        if (moviesInstance.id === currentMovies.id) {
          setCurrentMovies(moviesInstance);
        }
      });
    });
  }

  useEffect(() => {
    if (!info.authenticateInfo.hasOwnProperty("token")) {
      navigate("/");
    } else {
      fetchMyAPI();
      fetchAllMovies();
    }
  }, []);

  const getDateMonth = (monthNumber) => {
    if (monthNumber === 1) return "JANUARY";
    else if (monthNumber === 2) return "FEBRUARY";
    else if (monthNumber === 3) return "MARCH";
    else if (monthNumber === 4) return "APRIL";
    else if (monthNumber === 5) return "MAY";
    else if (monthNumber === 6) return "JUNE";
    else if (monthNumber === 7) return "JULY";
    else if (monthNumber === 8) return "AUGUST";
    else if (monthNumber === 9) return "SEPTEMBER";
    else if (monthNumber === 10) return "OCTOBER";
    else if (monthNumber === 11) return "NOVEMBER";
    else if (monthNumber === 12) return "DECEMBER";
    else return "";
  };

  const selectMovies = (clickedMovies) => {
    setShowMoviesModal(true);
    setCurrentMovies(clickedMovies);
  };

  async function addComment(event) {
    if (event.key === "Enter") {
      if (currentCommentContent.length > 0) {
        const commentDataResponse = await AddCommentAPI(
          { content: currentCommentContent, date: formatDate(new Date()) },
          currentMovies.id,
          info.authenticateInfo.token
        );
        if (!commentDataResponse.hasOwnProperty("status")) {
          setCurrentCommentContent("");
          fetchAllMovies();
        } else {
          Toast.fire({
            icon: "error",
            title: "There was an error adding a new comment!",
          });
        }
      }
    }
  }

  const formatDate = (date) => {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const deleteComment = (commentInstance) => {
    Swal.fire({
      title: `Are you sure you want to delete this comment?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I am.",
      cancelButtonText: "No, I am not.",
    }).then((result) => {
      if (result.value) {
        deleteSelectedComment(commentInstance.id);
      }
    });
  };

  async function deleteSelectedComment(commentId) {
    const commentDeletionResponse = await DeleteCommentAPI(
      commentId,
      info.authenticateInfo.token
    );
    if (!commentDeletionResponse.hasOwnProperty("status")) {
      fetchAllMovies();
      Toast.fire({
        icon: "success",
        title: "Comment deleted!",
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "There was an error deleting the comment!",
      });
    }
  }
  return (
    <div className={styles.dashboard}>
      <Sidebar user={currentUser} />
      <div className={styles.dashboardMain}>
        <Container>
          <div className={styles.dashboardDescription}>
            <h2>{currentUser.name}, </h2>
            <h4>Welcome to the homepage of CineBox</h4>
          </div>
          <div className={styles.postsWrapper}>
            {movies.length > 0
              ? movies.map((moviesInstance) => {
                  return (
                    <div
                      key={moviesInstance.id}
                      className={styles.postWrapper}
                      onClick={() => selectMovies(moviesInstance)}
                      style={{
                        backgroundImage: `url(${moviesInstance.thumbnail})`,
                      }}
                    ></div>
                  );
                })
              : null}
          </div>
        </Container>
      </div>

      {/* Movies modal */}
      <Modal
        show={showMoviesModal}
        onHide={() => setShowMoviesModal(false)}
        centered
        size="lg"
        className={styles.moviesModal + " p-4"}
      >
        {/*<CloseButton onClick={() => setShowMoviesModal(false)} className={styles.modalCloseButton}/>*/}
        <Modal.Title className="p-4">
          <h1>
            {currentMovies.title + " (" + currentMovies.releaseYear + ")"}
          </h1>
          <h5>{currentMovies.genre}</h5>
        </Modal.Title>
        <hr />
        <Modal.Body className="p-4">
          <p>
            Projection date:{" "}
            <strong>
              {currentMovies.date.substring(8, 10)}{" "}
              {getDateMonth(new Date(currentMovies.date).getMonth() + 1)}
            </strong>
          </p>
          {currentMovies.description}
          <ListGroup className="mt-4">
            {currentMovies.comments ? (
              currentMovies.comments.length > 0 ? (
                <p>
                  <strong>Comments</strong>
                </p>
              ) : (
                <p>
                  <strong>No comments</strong>
                </p>
              )
            ) : null}
            {currentMovies.comments
              ? currentMovies.comments.length > 0
                ? currentMovies.comments
                    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
                    .map((comment) => {
                      return (
                        <ListGroup.Item
                          key={comment.id}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <div className="d-flex flex-column">
                            <span>
                              <strong>
                                {comment.postedBy.name}{" "}
                                {comment.postedBy.surname}
                              </strong>
                            </span>
                            <span style={{ fontSize: "12px" }}>
                              {formatDate(comment.createdAt)}
                            </span>
                            <span>{comment.content}</span>
                          </div>

                          {currentUser.role.name === "ADMIN" ? (
                            <i
                              className="fas fa-times pl-5 pt-2 pb-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => deleteComment(comment)}
                            ></i>
                          ) : null}
                        </ListGroup.Item>
                      );
                    })
                : null
              : null}
          </ListGroup>
        </Modal.Body>
        {currentUser.role.name !== "GUEST" ? (
          <Modal.Footer className="p-4">
            <Form.Group controlId="send_message" className="w-100">
              <Form.Control
                type="text"
                placeholder="Comment..."
                value={currentCommentContent}
                onChange={(e) => setCurrentCommentContent(e.target.value)}
                onKeyPress={addComment}
              />
            </Form.Group>
          </Modal.Footer>
        ) : null}
      </Modal>
    </div>
  );
}
