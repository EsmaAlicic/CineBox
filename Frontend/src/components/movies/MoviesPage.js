import React, { useState, useEffect } from "react";
import { GetCurrentUserAPI } from "../../services/UserService";
import {
  GetAllMoviesAPI,
  AddMoviesAPI,
  UpdateMoviesAPI,
  DeleteMoviesAPI,
} from "../../services/MoviesService";
import { useNavigate } from "react-router-dom";
import Sidebar from "../partials/sidebar/Sidebar";
import styles from "./movies.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/actions/Actions";
import { Button, Form, Modal, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

export default function MoviesPage() {
  const navigate = useNavigate();
  const [showsMoviesModal, setShowsMoviesModal] = useState(false);
  const [showsMoviesUpdateModal, setShowsMoviesUpdateModal] = useState(false);
  const [movies, setMovies] = useState([]);

  const [selectedMoviesInstance, setSelectedMoviesInstance] = useState({
    id: "",
    title: "",
    description: "",
    date: "",
    genre: "",
    thumbnail: "",
    releaseYear: "",
  });

  const dispatch = useDispatch();
  const info = useSelector((state) => {
    return state.authenticateToken;
  });

  async function fetchMyAPI() {
    await GetCurrentUserAPI(info.authenticateInfo.token).then((res) => {
      dispatch(setUser(res));
    });
  }

  async function fetchAllMovies() {
    await GetAllMoviesAPI(info.authenticateInfo.token).then((res) => {
      setMovies(res);
    });
  }

  useEffect(() => {
    if (!info.authenticateInfo.hasOwnProperty("token")) {
      navigate("/");
    } else {
      if (info.authenticateInfo.role !== "ADMIN") {
        navigate("/");
      } else {
        fetchMyAPI();
        fetchAllMovies();
      }
    }
  }, []);

  const editMovies = (moviesInstance) => {
    setSelectedMoviesInstance(moviesInstance);
    setMoviesUpdateTitle(moviesInstance.title);
    setMoviesUpdateDescription(moviesInstance.description);
    setMoviesUpdateDate(new Date(moviesInstance.date));
    setMoviesUpdateGenre(moviesInstance.genre);
    setMoviesUpdateThumbnail(moviesInstance.thumbnail);
    setMoviesUpdateReleaseYear(moviesInstance.releaseYear);
    setShowsMoviesUpdateModal(true);
  };

  const deleteMovies = (moviesInstance) => {
    Swal.fire({
      title: `Are you sure you want to delete this movie?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I am.",
      cancelButtonText: "No, I am not.",
    }).then((result) => {
      if (result.value) {
        deleteSelectedMovies(moviesInstance.id);
      }
    });
  };

  async function deleteSelectedMovies(moviesId) {
    const moviesDeletionResponse = await DeleteMoviesAPI(
      moviesId,
      info.authenticateInfo.token
    );
    if (!moviesDeletionResponse.hasOwnProperty("status")) {
      fetchAllMovies();
      Toast.fire({
        icon: "success",
        title: "Movie successfully deleted!",
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "An error occurred during the deletion of the movie!",
      });
    }
  }

  const [moviesTitle, setMoviesTitle] = useState("");
  const [moviesDate, setMoviesDate] = useState(new Date());
  const [moviesDescription, setMoviesDescription] = useState("");
  const [moviesGenre, setMoviesGenre] = useState("");
  const [moviesThumbnail, setMoviesThumbnail] = useState("");
  const [moviesReleaseYear, setMoviesReleaseYear] = useState("");

  const [moviesUpdateTitle, setMoviesUpdateTitle] = useState("");
  const [moviesUpdateDate, setMoviesUpdateDate] = useState("");
  const [moviesUpdateDescription, setMoviesUpdateDescription] = useState("");
  const [moviesUpdateGenre, setMoviesUpdateGenre] = useState("");
  const [moviesUpdateThumbnail, setMoviesUpdateThumbnail] = useState("");
  const [moviesUpdateReleaseYear, setMoviesUpdateReleaseYear] = useState("");

  const moviesFormFilled = [
    { id: "movies_title", filledName: "Movie's title", valid: false },
    { id: "movies_date", filledName: "Projection date", valid: false },
    {
      id: "movies_description",
      filledName: "Movie's description",
      valid: false,
    },
    { id: "movies_genre", filledName: "Movie's genre", valid: false },
    { id: "movies_thumbnail", filledName: "Movie's thumbnail", valid: false },
    {
      id: "movies_release_year",
      filledName: "Movie's release year",
      valid: false,
    },
  ];

  const validateMoviesTitle = () => {
    if (moviesTitle.length < 3) {
      moviesFormFilled[0].valid = false;
      return false;
    } else {
      moviesFormFilled[0].valid = true;
      return true;
    }
  };

  const validateMoviesDate = () => {
    if (!moviesDate) {
      moviesFormFilled[1].valid = false;
      return false;
    } else {
      moviesFormFilled[1].valid = true;
      return true;
    }
  };

  const validateMoviesDescription = () => {
    if (moviesDescription.length < 3) {
      moviesFormFilled[2].valid = false;
      return false;
    } else {
      moviesFormFilled[2].valid = true;
      return true;
    }
  };

  const validateMoviesGenre = () => {
    if (moviesGenre.length < 3) {
      moviesFormFilled[3].valid = false;
      return false;
    } else {
      moviesFormFilled[3].valid = true;
      return true;
    }
  };

  const validateMoviesThumbnail = () => {
    if (moviesThumbnail.length < 3) {
      moviesFormFilled[4].valid = false;
      return false;
    } else {
      moviesFormFilled[4].valid = true;
      return true;
    }
  };

  const validateMoviesReleaseYear = () => {
    if (moviesReleaseYear.length < 3) {
      moviesFormFilled[5].valid = false;
      return false;
    } else {
      moviesFormFilled[5].valid = true;
      return true;
    }
  };

  const [allMoviesInputValid, setAllMoviesInputValid] = useState({
    valid: false,
    invalidField: "",
  });

  const moviesUpdateFormFilled = [
    { id: "movies_update_title", filledName: "Movie's title", valid: false },
    { id: "movies_update_date", filledName: "Projection date", valid: false },
    {
      id: "movies_update_description",
      filledName: "Movie's description",
      valid: false,
    },
    { id: "movies_update_genre", filledName: "Movie's genre", valid: false },
    {
      id: "movies_update_thumbnail",
      filledName: "Movie's thumbnail",
      valid: false,
    },
    {
      id: "movies_update_release_year",
      filledName: "Movie's release year",
      valid: false,
    },
  ];

  const validateMoviesUpdateTitle = () => {
    if (moviesUpdateTitle.length < 3) {
      moviesUpdateFormFilled[0].valid = false;
      return false;
    } else {
      moviesUpdateFormFilled[0].valid = true;
      return true;
    }
  };

  const validateMoviesUpdateDate = () => {
    if (!moviesUpdateDate) {
      moviesUpdateFormFilled[1].valid = false;
      return false;
    } else {
      moviesUpdateFormFilled[1].valid = true;
      return true;
    }
  };

  const validateMoviesUpdateDescription = () => {
    if (moviesUpdateDescription.length < 3) {
      moviesUpdateFormFilled[2].valid = false;
      return false;
    } else {
      moviesUpdateFormFilled[2].valid = true;
      return true;
    }
  };

  const validateMoviesUpdateGenre = () => {
    if (moviesUpdateGenre.length < 3) {
      moviesUpdateFormFilled[3].valid = false;
      return false;
    } else {
      moviesUpdateFormFilled[3].valid = true;
      return true;
    }
  };

  const validateMoviesUpdateThumbnail = () => {
    if (moviesUpdateThumbnail.length < 3) {
      moviesUpdateFormFilled[4].valid = false;
      return false;
    } else {
      moviesUpdateFormFilled[4].valid = true;
      return true;
    }
  };

  const validateMoviesUpdateReleaseYear = () => {
    if (moviesUpdateReleaseYear.length < 3) {
      moviesUpdateFormFilled[5].valid = false;
      return false;
    } else {
      moviesUpdateFormFilled[5].valid = true;
      return true;
    }
  };

  const [allMoviesUpdateInputValid, setAllMoviesUpdateInputValid] = useState({
    valid: false,
    invalidField: "",
  });

  const formatDate = (date) => {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const validateMoviesFormOnSubmit = async () => {
    var countValidData = 0;
    moviesFormFilled
      .slice()
      .reverse()
      .forEach((item) => {
        if (!item.valid) {
          setAllMoviesInputValid({
            valid: false,
            invalidField: item.filledName,
          });
          document.getElementById(item.id)?.focus();
          countValidData--;
        }
        countValidData++;
      });
    if (countValidData === 6) {
      setAllMoviesInputValid({ valid: true, invalidField: "" });
      let moviesData = {
        title: moviesTitle,
        description: moviesDescription,
        date: moviesDate,
        genre: moviesGenre,
        thumbnail: moviesThumbnail,
        releaseYear: moviesReleaseYear,
      };
      const moviesDataResponse = await AddMoviesAPI(
        moviesData,
        info.authenticateInfo.token
      );
      if (!moviesDataResponse.hasOwnProperty("status")) {
        setShowsMoviesModal(false);
        setMoviesTitle("");
        setMoviesDate("");
        setMoviesDescription("");
        setMoviesGenre("");
        setMoviesThumbnail("");
        setMoviesReleaseYear("");
        fetchAllMovies();
        Toast.fire({
          icon: "success",
          title: "New movie successfully added!",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "An error occurred during the creation of a new movie!",
        });
      }
    }
  };

  const validateMoviesUpdateFormOnSubmit = async () => {
    var countValidData = 0;
    moviesUpdateFormFilled
      .slice()
      .reverse()
      .forEach((item) => {
        if (!item.valid) {
          setAllMoviesUpdateInputValid({
            valid: false,
            invalidField: item.filledName,
          });
          document.getElementById(item.id)?.focus();
          countValidData--;
        }
        countValidData++;
      });
    if (countValidData === 6) {
      setAllMoviesUpdateInputValid({ valid: true, invalidField: "" });
      let moviesUpdateData = {
        id: selectedMoviesInstance.id,
        title: moviesUpdateTitle,
        description: moviesUpdateDescription,
        date: moviesDate,
        genre: moviesUpdateGenre,
        thumbnail: moviesUpdateThumbnail,
        releaseYear: moviesUpdateReleaseYear,
      };
      const moviesUpdateDataResponse = await UpdateMoviesAPI(
        moviesUpdateData,
        info.authenticateInfo.token
      );
      if (!moviesUpdateDataResponse.hasOwnProperty("status")) {
        setShowsMoviesUpdateModal(false);
        fetchAllMovies();
        Toast.fire({
          icon: "success",
          title: "Movie successfully modified!",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "An error occurred during the modification of the movie!",
        });
      }
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="container">
        <div className={styles.textBox}>
          <h2>
            <strong>Movies</strong>
          </h2>
        </div>
        <div className={styles.moviesContainer}>
          <Button
            className={styles.moviesButton}
            onClick={() => setShowsMoviesModal(true)}
          >
            Add new movie
          </Button>
          <Table responsive hover bordered className="mt-4">
            <thead>
              <tr className="bg-secondary text-white">
                <td>
                  <strong>Title</strong>
                </td>
                <td>
                  <strong>Description</strong>
                </td>
                <td>
                  <strong>Projection date</strong>
                </td>
                <td>
                  <strong>Edit</strong>
                </td>
                <td>
                  <strong>Delete</strong>
                </td>
              </tr>
            </thead>
            <tbody>
              {movies.length > 0
                ? movies.map((moviesInstance) => {
                    return (
                      <tr key={moviesInstance.id}>
                        <td>{moviesInstance.title}</td>
                        <td>{moviesInstance.description}</td>
                        <td>{formatDate(moviesInstance.date)}</td>
                        <td>
                          <Button
                            className="btn btn-sm"
                            variant="secondary"
                            onClick={() => editMovies(moviesInstance)}
                          >
                            Edit
                          </Button>
                        </td>
                        <td>
                          <Button
                            className="btn btn-sm"
                            variant="danger"
                            onClick={() => deleteMovies(moviesInstance)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Movies creation modal */}
      <Modal
        show={showsMoviesModal}
        onHide={() => setShowsMoviesModal(false)}
        centered
      >
        <Modal.Title className="p-4">Add a new movie</Modal.Title>
        <Modal.Body>
          <Form.Group controlId="movies_title">
            <Form.Label>Enter the movie's title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Movie's title"
              value={moviesTitle}
              onChange={(e) => setMoviesTitle(e.target.value)}
            />
            {!validateMoviesTitle() && (
              <>
                <p className={styles.requiredField}>
                  Movie's title is mandatory.
                </p>
              </>
            )}
          </Form.Group>

          <Form.Group controlId="movies_date" className="mt-4">
            <Form.Label>Enter the movie's projection date</Form.Label>
            <DatePicker
              onChange={(date) => setMoviesDate(date)}
              dateFormat={"dd/MM/yyyy HH:mm"}
              timeFormat={"HH:mm"}
              className="form-control"
              placeholder="Movie's projection date"
              selected={moviesDate}
            />
            {!validateMoviesDate() && (
              <>
                <p className={styles.requiredField}>
                  Movie's projection date is mandatory.
                </p>
              </>
            )}
          </Form.Group>

          <Form.Group controlId="movies_description" className="mt-4">
            <Form.Label>Enter the movie's description</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              type="text"
              placeholder="Movie's description"
              value={moviesDescription}
              onChange={(e) => setMoviesDescription(e.target.value)}
            />
            {!validateMoviesDescription() && (
              <>
                <p className={styles.requiredField}>
                  Movie's description is mandatory.
                </p>
              </>
            )}
          </Form.Group>

          <Form.Group controlId="movies_genre" className="mt-4">
            <Form.Label>Enter the movie's genre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Movie's genre"
              value={moviesGenre}
              onChange={(e) => setMoviesGenre(e.target.value)}
            />
            {!validateMoviesGenre() && (
              <>
                <p className={styles.requiredField}>
                  Movie's genre is mandatory.
                </p>
              </>
            )}
          </Form.Group>

          <Form.Group controlId="movies_thumbnail" className="mt-4">
            <Form.Label>Enter the movie's thumbnail</Form.Label>
            <Form.Control
              type="text"
              placeholder="Movie's thumbnail"
              value={moviesThumbnail}
              onChange={(e) => setMoviesThumbnail(e.target.value)}
            />
            {!validateMoviesThumbnail() && (
              <>
                <p className={styles.requiredField}>
                  Movie's thumbnail is mandatory.
                </p>
              </>
            )}
          </Form.Group>

          <Form.Group controlId="movies_release_year" className="mt-4">
            <Form.Label>Enter the movie's release year</Form.Label>
            <Form.Control
              type="text"
              placeholder="Movie's release year"
              value={moviesReleaseYear}
              onChange={(e) => setMoviesReleaseYear(e.target.value)}
            />
            {!validateMoviesReleaseYear() && (
              <>
                <p className={styles.requiredField}>
                  Movie's release year is mandatory.
                </p>
              </>
            )}
          </Form.Group>

          {allMoviesInputValid.invalidField !== "" ? (
            <p className={styles.requiredField}>
              {allMoviesInputValid.invalidField} is a mandatory field!
            </p>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowsMoviesModal(false)}
          >
            Close
          </Button>
          <Button
            className={styles.button}
            onClick={validateMoviesFormOnSubmit}
          >
            Add movie
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Movies update modal */}
      <Modal
        show={showsMoviesUpdateModal}
        onHide={() => setShowsMoviesUpdateModal(false)}
        centered
      >
        <Modal.Title className="p-4">Uređivanje filma</Modal.Title>
        <Modal.Body>
          <Form.Group controlId="movies_update_title">
            <Form.Label>Enter the movie's title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Movie's title"
              value={moviesUpdateTitle}
              onChange={(e) => setMoviesUpdateTitle(e.target.value)}
            />
            {!validateMoviesUpdateTitle() && (
              <>
                <p className={styles.requiredField}>
                  Movie's title is mandatory.
                </p>
              </>
            )}
          </Form.Group>

          <Form.Group controlId="movies_update_date" className="mt-4">
            <Form.Label>Enter the movie's projection date</Form.Label>
            <DatePicker
              onChange={(date) => setMoviesUpdateDate(date)}
              dateFormat={"dd/MM/yyyy HH:mm"}
              timeFormat={"HH:mm"}
              className="form-control"
              placeholder="Movie's projection date"
              selected={moviesUpdateDate}
            />
            {!validateMoviesUpdateDate() && (
              <>
                <p className={styles.requiredField}>
                  Movie's projection date is mandatory.
                </p>
              </>
            )}
          </Form.Group>

          <Form.Group controlId="movies_update_description" className="mt-4">
            <Form.Label>Enter the movie's description</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              type="text"
              placeholder="Movie's description"
              value={moviesUpdateDescription}
              onChange={(e) => setMoviesUpdateDescription(e.target.value)}
            />
            {!validateMoviesUpdateDescription() && (
              <>
                <p className={styles.requiredField}>
                  Movie's description is mandatory.
                </p>
              </>
            )}
          </Form.Group>

          <Form.Group controlId="movies_update_genre" className="mt-4">
            <Form.Label>Enter the movie's genre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Movie's genre"
              value={moviesUpdateGenre}
              onChange={(e) => setMoviesUpdateGenre(e.target.value)}
            />
            {!validateMoviesUpdateGenre() && (
              <>
                <p className={styles.requiredField}>
                  Movie's genre is mandatory.
                </p>
              </>
            )}
          </Form.Group>

          <Form.Group controlId="movies_update_thumbnail" className="mt-4">
            <Form.Label>Enter the movie's thumbnail</Form.Label>
            <Form.Control
              type="text"
              placeholder="Movie's thumbnail"
              value={moviesUpdateThumbnail}
              onChange={(e) => setMoviesUpdateThumbnail(e.target.value)}
            />
            {!validateMoviesUpdateThumbnail() && (
              <>
                <p className={styles.requiredField}>
                  Movie's thumbnail is mandatory.
                </p>
              </>
            )}
          </Form.Group>

          <Form.Group controlId="movies_update_release_year" className="mt-4">
            <Form.Label>Enter the movie's release year</Form.Label>
            <Form.Control
              type="text"
              placeholder="Movie's release year"
              value={moviesUpdateReleaseYear}
              onChange={(e) => setMoviesUpdateReleaseYear(e.target.value)}
            />
            {!validateMoviesUpdateReleaseYear() && (
              <>
                <p className={styles.requiredField}>
                  Movie's release year is mandatory.
                </p>
              </>
            )}
          </Form.Group>

          {allMoviesUpdateInputValid.invalidField !== "" ? (
            <p className={styles.requiredField}>
              {allMoviesUpdateInputValid.invalidField} is a mandatory field!
            </p>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowsMoviesUpdateModal(false)}
          >
            Close
          </Button>
          <Button
            className={styles.button}
            onClick={validateMoviesUpdateFormOnSubmit}
          >
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
