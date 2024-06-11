import React, { useState, useEffect } from "react";
import { Button, Offcanvas, ListGroup } from "react-bootstrap";
import CloseButton from "react-bootstrap/CloseButton";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./sidebar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { GetCurrentUserAPI } from "../../../services/UserService";
import { setUser } from "../../../redux/actions/Actions";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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

export default function Sidebar() {
  const [showSidebar, setShowSidebar] = useState(true);
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);
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

  useEffect(() => {
    async function fetchMyAPI() {
      await GetCurrentUserAPI(info.authenticateInfo.token).then((res) => {
        setCurrentUser(res);
        dispatch(setUser(res));
      });
    }

    if (!info.authenticateInfo.hasOwnProperty("token")) {
      navigate("/");
    } else {
      fetchMyAPI();
    }
  }, [info]);

  return (
    <div className={styles.sidebar}>
      <Button
        className="mt-2 position-absolute"
        style={{
          backgroundColor: "#3e4444",
          border: "none",
          borderRadius: "0",
        }}
        onClick={() => setShowSidebar(true)}
      >
        <i className="fas fa-bars"></i>
      </Button>
      <Offcanvas
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        className={styles.sidebar}
      >
        <CloseButton
          variant="white"
          onClick={() => setShowSidebar(false)}
          className={styles.sidebarCloseButton}
        />
        <Offcanvas.Header className={styles.sidebarHeader}>
          <div className={styles.sidebarHeaderTextWrapper}>
            <p className={styles.userName}>
              {currentUser.name} {currentUser.surname}
            </p>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup>
            <Link className={styles.sidebarLink} to="/main">
              <ListGroup.Item className={styles.sidebarLineItem} action>
                <span className={styles.sidebarText}>Home</span>
              </ListGroup.Item>
            </Link>
            {currentUser.role.name != "GUEST" ? (
              <Link className={styles.sidebarLink} to="/main/profile">
                <ListGroup.Item className={styles.sidebarLineItem} action>
                  <span className={styles.sidebarText}>Profile</span>
                </ListGroup.Item>
              </Link>
            ) : null}
            {currentUser.role.name == "ADMIN" ? (
              <Link className={styles.sidebarLink} to="/main/movies">
                <ListGroup.Item className={styles.sidebarLineItem} action>
                  <span className={styles.sidebarText}>Films</span>
                </ListGroup.Item>
              </Link>
            ) : null}
            {currentUser.role.name == "ADMIN" ? (
              <Link className={styles.sidebarLink} to="/main/users">
                <ListGroup.Item className={styles.sidebarLineItem} action>
                  <span className={styles.sidebarText}>Users</span>
                </ListGroup.Item>
              </Link>
            ) : null}
            <Link className={styles.sidebarLink} to="/">
              <ListGroup.Item className={styles.sidebarLineItem} action>
                <span
                  className={styles.sidebarText}
                  onClick={() => {
                    localStorage.clear();
                  }}
                >
                  Log out
                </span>
              </ListGroup.Item>
            </Link>
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
