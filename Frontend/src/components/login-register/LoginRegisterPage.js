import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { LoginAPI, RegisterAPI } from "../../services/LoginRegisterService"
import { useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux";
import {setAuthenticateToken} from "../../redux/actions/Actions";
import { BrowserRouter as Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './login-register.module.css';
import logo from '../../assets/images/login.jpg'

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

export default function LoginRegisterPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [registerName, setRegisterName] = useState("")
    const [registerSurname, setRegisterSurname] = useState("")
    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")

    const loginFormFilled = [
        { id:"login_email", filledName: "Email", valid: false },
        { id:"login_password", filledName: "Password", valid: false },
    ];

    const registerFormFilled = [
        { id:"register_name", filledName: "First name", valid: false },
        { id:"register_surname", filledName: "Last name", valid: false },
        { id:"register_email", filledName: "Email", valid: false },
        { id:"register_password", filledName: "Password", valid: false },
    ];

    const validateLoginEmail = () => {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(String(email).toLowerCase())) {
          loginFormFilled[0].valid = false;
          return false;
        } else {
          loginFormFilled[0].valid = true;
          return true;
        }
    };

    const validateLoginPassword = () => {
        if (password.length < 6) {
          loginFormFilled[1].valid = false;
          return false;
        } else {
          loginFormFilled[1].valid = true;
          return true;
        }
    };

    const validateRegisterName = () => {
        if (registerName.length < 3) {
            registerFormFilled[0].valid = false;
          return false;
        } else {
          registerFormFilled[0].valid = true;
          return true;
        }
    };

    const validateRegisterSurname = () => {
        if (registerSurname.length < 3) {
          registerFormFilled[1].valid = false;
          return false;
        } else {
          registerFormFilled[1].valid = true;
          return true;
        }
    };

    const validateRegisterEmail = () => {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!regex.test(String(registerEmail).toLowerCase())) {
          registerFormFilled[2].valid = false;
          return false;
        } else {
          registerFormFilled[2].valid = true;
          return true;
        }
    };

    const validateRegisterPassword = () => {
        if (registerPassword.length < 6) {
          registerFormFilled[3].valid = false;
          return false;
        } else {
          registerFormFilled[3].valid = true;
          return true;
        }
    };

    const [allLoginInputValid, setAllLoginInputValid] = useState({
        valid: false,
        invalidField: "",
    });

    const [allRegisterInputValid, setAllRegisterInputValid] = useState({
        valid: false,
        invalidField: "",
    });

    const validateLoginOnSubmit = async () => {
        var countValidData = 0;
        loginFormFilled.slice().reverse().forEach((item) => {
            if (!item.valid) {
                setAllLoginInputValid({ valid: false, invalidField: item.filledName });
                document.getElementById(item.id).focus();
                countValidData--;
            }
            countValidData++;
          });
        if (countValidData == 2) {
            setAllLoginInputValid({ valid: true, invalidField: "" });
            let loginData = {
                email: email,
                password: password
            }
            const userInfo = await LoginAPI(loginData);
            if (userInfo.hasOwnProperty('token')) {
                dispatch(setAuthenticateToken(userInfo));
                Toast.fire({
                    icon: "success",
                    title: "User successfully logged in.",
                });
                navigate('/main')
            } else {
                if (!userInfo.hasOwnProperty('status')) {
                    Toast.fire({
                        icon: "error",
                        title: "The user is inactive!",
                    });
                } else {
                    Toast.fire({
                        icon: "error",
                        title: "Incorrect data entered!",
                    });
                }
            }
        }
    };

    const validateRegisterOnSubmit = async () => {
        var countValidData = 0;
        registerFormFilled.slice().reverse().forEach((item) => {
            if (!item.valid) {
                setAllRegisterInputValid({ valid: false, invalidField: item.filledName });
                document.getElementById(item.id).focus();
                countValidData--;
            }
            countValidData++;
          });
        if (countValidData == 4) {
            setAllRegisterInputValid({ valid: true, invalidField: "" });
            let registerData = {
                name: registerName,
                surname: registerSurname,
                email: registerEmail,
                password: registerPassword
            }
            const usersData = await RegisterAPI(registerData)
            if(!usersData.hasOwnProperty('status')) {
                Toast.fire({
                    icon: "success",
                    title: "User account successfully created.",
                });
                setShowRegisterModal(false)
                setRegisterName("")
                setRegisterSurname("")
                setRegisterEmail("")
                setRegisterPassword("")
            } else {
                Toast.fire({
                    icon: "error",
                    title: "The entered email already exists!",
                });
            }
        }
    };

    const loginAsGuest = async () => {
        let loginData = {
            email: "wp@guest.com",
            password: "guest123"
        }
        const userInfo = await LoginAPI(loginData);
        if (userInfo.hasOwnProperty('token')) {
            dispatch(setAuthenticateToken(userInfo));
            Toast.fire({
                icon: "success",
                title: "Welcome!",
            });
            navigate('/main')
        } else {
            if (!userInfo.hasOwnProperty('status')) {
                Toast.fire({
                    icon: "error",
                    title: "The user is inactive!",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "Incorrect data entered!",
                });
            }
        }
    }

    return redirect ? (<Navigate exact from="/" to="/main" />) : (
        <div className={styles.home}>
            <div className={styles.mainDiv}>
                <div className={styles.descriptionBox}>
                    <div className={styles.logoBox}>
                        <img alt="logo" src={logo}/>
                    </div>
                    <div className={styles.titleBox}>
                        <h2>
                            <strong> CineBox - Your cinema, our system. </strong>
                        </h2>
                        <p>
                            Experience the future of the cinema industry today.
                        </p>
                    </div>
                    <Button className={styles.registerButton} onClick={() => setShowRegisterModal(true)}>
                    Are you not registered?
                    </Button>
                    <div className={styles.loginBox}>
                    <p>Already registered?<a className={styles.loginOpen} href="#" onClick={() => setShowLoginModal(true)}><br/>Log in</a></p>                    
                    </div>
                    <Button className={styles.button} onClick={() => loginAsGuest()}>
                    Continue as guest!
                    </Button>
                </div>
            </div>
        
            {/* Login modal */}
            <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
                <Modal.Title className="p-4">
                Login
                </Modal.Title>
                <Modal.Body>
                    <Form.Group controlId="login_email">
                        <Form.Label>Enter your email address</Form.Label>
                        <Form.Control type="email" placeholder="Your email address" value={email}  onChange={e => setEmail(e.target.value)}/>
                        {!validateLoginEmail() && (
                            <>
                                <p className={styles.requiredField}>Email is required.</p>
                            </>
                        )}
                    </Form.Group>

                    <Form.Group controlId="login_password" className="mt-4">
                        <Form.Label>Enter your email password</Form.Label>
                        <Form.Control type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)}/>
                        {!validateLoginPassword() && (
                            <>
                                <p className={styles.requiredField}>Password is required.</p>
                            </>
                        )}
                    </Form.Group>
                    {allLoginInputValid.invalidField != '' ? (
                        <p className={styles.requiredField}>
                            {allLoginInputValid.invalidField} is a required field. Please fill it in!
                        </p>
                    ) : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
                        Close
                    </Button>
                    <Button className={styles.button} onClick={validateLoginOnSubmit}>
                        Log in
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Register modal */}
            <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} centered>
                <Modal.Title className="p-4">
                    Registration
                </Modal.Title>
                <Modal.Body>
                    <Form.Group controlId="register_name">
                        <Form.Label>Enter your first name</Form.Label>
                        <Form.Control type="text" placeholder="Name" value={registerName}  onChange={e => setRegisterName(e.target.value)}/>
                        {!validateRegisterName() && (
                            <>
                                <p className={styles.requiredField}>First name is required.</p>
                            </>
                        )}
                    </Form.Group>

                    <Form.Group controlId="register_surname" className="mt-4">
                        <Form.Label>Enter your last name</Form.Label>
                        <Form.Control type="text" placeholder="Last name" value={registerSurname} onChange={e => setRegisterSurname(e.target.value)}/>
                        {!validateRegisterSurname() && (
                            <>
                                <p className={styles.requiredField}>Last name is required.</p>
                            </>
                        )}
                    </Form.Group>

                    <Form.Group controlId="register_email" className="mt-4">
                        <Form.Label>Enter your email address</Form.Label>
                        <Form.Control type="email" placeholder="Email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)}/>
                        {!validateRegisterEmail() && (
                            <>
                                <p className={styles.requiredField}>A valid email format is required.</p>
                            </>
                        )}
                    </Form.Group>

                    <Form.Group controlId="register_password" className="mt-4">
                        <Form.Label>Enter your password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)}/>
                        {!validateRegisterPassword() && (
                            <>
                                <p className={styles.requiredField}>Password is required.</p>
                            </>
                        )}
                    </Form.Group>
                    {allRegisterInputValid.invalidField != '' ? (
                        <p className={styles.requiredField}>
                            {allRegisterInputValid.invalidField} is a required field. Please fill it in!
                        </p>
                    ) : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRegisterModal(false)}>
                        Close
                    </Button>
                    <Button className={styles.button} onClick={validateRegisterOnSubmit}>
                        Register
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}