import React, { useState, useEffect } from 'react'
import { GetCurrentUserAPI, GetAllUsersAPI, ActivateUserAPI, DeactivateUserAPI, UpdateUserAPI } from "../../services/UserService"
import { useNavigate } from "react-router-dom";
import Sidebar from '../partials/sidebar/Sidebar'
import styles from './users.module.css'
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/actions/Actions";
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { RegisterAPI } from "../../services/LoginRegisterService"
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

export default function UsersPage() {
    const navigate = useNavigate();
    const [showsUsersModal, setShowUsersModal] = useState(false);
    const [showsUsersUpdateModal, setShowUsersUpdateModal] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        name: '',
        surname: ''
    });
    const [selectedUser, setSelectedUser] = useState({
        id: '',
        name: '',
        surname: ''
    });
    const [users, setUsers] = useState([]);

    const dispatch = useDispatch();
    const info = useSelector((state) => {
        return state.authenticateToken;
    });

    async function fetchMyAPI() {
        await GetCurrentUserAPI(info.authenticateInfo.token).then(res => {
            setCurrentUser(res);
            dispatch(setUser(res));
        })
    }

    async function fetchAllUsers() {
        await GetAllUsersAPI(info.authenticateInfo.token).then(res => {
            setUsers(res);
        })
    }

    async function activateSelectedUser(userId) {
        const userActivationResponse = await ActivateUserAPI(info.authenticateInfo.token, userId);
        if(!userActivationResponse.hasOwnProperty('status')) {
            fetchAllUsers();
            Toast.fire({
                icon: "success",
                title: "User activated!",
            });
        } else {
            Toast.fire({
                icon: "error",
                title: "An error occurred while activating the user!",
            });
        }
    }

    async function deactivateSelectedUser(userId) {
        const userDeactivationResponse = await DeactivateUserAPI(info.authenticateInfo.token, userId);
        if(!userDeactivationResponse.hasOwnProperty('status')) {
            fetchAllUsers();
            Toast.fire({
                icon: "success",
                title: "User deactivated!",
            });
        } else {
            Toast.fire({
                icon: "error",
                title: "An error occurred while deactivating the user!",
            });
        }
    }

    useEffect(() => {
        if(!info.authenticateInfo.hasOwnProperty('token')) {
            navigate('/');
        }
        else {
            if(info.authenticateInfo.role !== 'ADMIN') {
                navigate('/');
            } else {
                fetchMyAPI();
                fetchAllUsers();
            }
        }
    }, [])

    const [updateName, setUpdateName] = useState("")
    const [updateSurname, setUpdateSurname] = useState("")
    const [registerName, setRegisterName] = useState("")
    const [registerSurname, setRegisterSurname] = useState("")
    const [registerEmail, setRegisterEmail] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")

    const registerFormFilled = [
        { id:"register_name", filledName: "First name", valid: false },
        { id:"register_surname", filledName: "Last name", valid: false },
        { id:"register_email", filledName: "Email", valid: false },
        { id:"register_password", filledName: "Password", valid: false },
    ];

    const updateFormFilled = [
        { id:"update_name", filledName: "First name", valid: false },
        { id:"update_surname", filledName: "Last name", valid: false },
    ];

    const validateUpdateName = () => {
        if (updateName.length < 3) {
            updateFormFilled[0].valid = false;
          return false;
        } else {
          updateFormFilled[0].valid = true;
          return true;
        }
    };

    const validateUpdateSurname = () => {
        if (updateSurname.length < 3) {
          updateFormFilled[1].valid = false;
          return false;
        } else {
          updateFormFilled[1].valid = true;
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

    const [allUpdateInputValid, setAllUpdateInputValid] = useState({
        valid: false,
        invalidField: "",
    });

    const [allRegisterInputValid, setAllRegisterInputValid] = useState({
        valid: false,
        invalidField: "",
    });

    const editUser = (user) => {
        setSelectedUser(user);
        setUpdateName(user.name)
        setUpdateSurname(user.surname)
        setShowUsersUpdateModal(true);
    }

    const validateUpdateOnSubmit = async () => {
        var countValidData = 0;
        updateFormFilled.slice().reverse().forEach((item) => {
            if (!item.valid) {
                setAllUpdateInputValid({ valid: false, invalidField: item.filledName });
                document.getElementById(item.id).focus();
                countValidData--;
            }
            countValidData++;
          });
        if (countValidData === 2) {
            setAllUpdateInputValid({ valid: true, invalidField: "" });
            let updateData = {
                id: selectedUser.id,
                name: updateName,
                surname: updateSurname
            }
            const usersData = await UpdateUserAPI(updateData, info.authenticateInfo.token)
            if(!usersData.hasOwnProperty('status')) {
                Toast.fire({
                    icon: "success",
                    title: "Selected user successfully updated!",
                });
                setShowUsersUpdateModal(false)
                fetchAllUsers();
            } else {
                Toast.fire({
                    icon: "error",
                    title: "An error occurred!",
                });
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
        if (countValidData === 4) {
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
                    title: "User account successfully created",
                });
                setShowUsersModal(false)
                setRegisterName("")
                setRegisterSurname("")
                setRegisterEmail("")
                setRegisterPassword("")
                fetchAllUsers();
            } else {
                Toast.fire({
                    icon: "error",
                    title: "The entered email already exists!",
                });
            }
        }
    };

    const activateUser = (user) => {
        Swal.fire({
            title: `Are you sure you want to activate the user: ${user.name} ${user.surname}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I am.",
            cancelButtonText: "No, I am not.",
        }).then((result) => {
            if (result.value) {
                activateSelectedUser(user.id);
            }
        })
    }

    const deactivateUser = (user) => {
        Swal.fire({
            title: `Are you sure you want to deactivate the user: ${user.name} ${user.surname}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, I am.",
            cancelButtonText: "No, I am not.",
        }).then((result) => {
            if (result.value) {
                deactivateSelectedUser(user.id);
                Toast.fire({
                    icon: "success",
                    title: "User deactivated!",
                });
            }
        })
    }


    return (
        <div>
            <Sidebar/>
            <div className="container">
                <div className={styles.textBox}>
                    <h2><strong>Users</strong></h2>
                </div>
                <div className={styles.filesContainer}>
                    <Button className={styles.usersButton} onClick={() => setShowUsersModal(true)}>
                        Add a new user
                    </Button>
                    <Table responsive hover bordered className="mt-4">
                        <thead>
                            <tr className="bg-secondary text-white">
                                <td><strong>First name</strong></td>
                                <td><strong>Last name</strong></td>
                                <td><strong>Email</strong></td>
                                <td><strong>Active</strong></td>
                                <td><strong>Status</strong></td>
                                <td><strong>Edit</strong></td>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? users.map(user => {
                                return user.email !== currentUser.email ? (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.surname}</td>
                                        <td>{user.email}</td>
                                        <td>{user.active ? "Da" : "Ne"}</td>
                                        <td>
                                            {user.active ? 
                                                <Button className="btn btn-sm" variant="danger" onClick={() => deactivateUser(user)}>
                                                    Deactivate user
                                                </Button> : 
                                                <Button className="btn btn-sm" variant="success" onClick={() => activateUser(user)}>
                                                    Activate user
                                                </Button>
                                            }
                                        </td>
                                        <td>
                                            <Button className={styles.usersButton} variant="outline-light" onClick={() => editUser(user)}>
                                                Edit user
                                            </Button>
                                        </td>
                                    </tr>
                                ) : null
                            }) : null} 
                        </tbody>
                    </Table>
                </div>
            </div>

            {/* Users registration modal */}
            <Modal show={showsUsersModal} onHide={() => setShowUsersModal(false)} centered>
                <Modal.Title className="p-4">
                    Registration of a new user
                </Modal.Title>
                <Modal.Body>
                <Form.Group controlId="register_name">
                        <Form.Label>Enter First name of the new user</Form.Label>
                        <Form.Control type="text" placeholder="First name" value={registerName}  onChange={e => setRegisterName(e.target.value)}/>
                        {!validateRegisterName() && (
                            <>
                                <p className={styles.requiredField}>First name is required.</p>
                            </>
                        )}
                    </Form.Group>

                    <Form.Group controlId="register_surname" className="mt-4">
                        <Form.Label>Enter Last name of the new user</Form.Label>
                        <Form.Control type="text" placeholder="Last name" value={registerSurname} onChange={e => setRegisterSurname(e.target.value)}/>
                        {!validateRegisterSurname() && (
                            <>
                                <p className={styles.requiredField}>Last name is required.</p>
                            </>
                        )}
                    </Form.Group>

                    <Form.Group controlId="register_email" className="mt-4">
                        <Form.Label>Enter Email of the new user</Form.Label>
                        <Form.Control type="email" placeholder="Email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)}/>
                        {!validateRegisterEmail() && (
                            <>
                                <p className={styles.requiredField}>Email is required.</p>
                            </>
                        )}
                    </Form.Group>

                    <Form.Group controlId="register_password" className="mt-4">
                        <Form.Label>Enter Password of the new user</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)}/>
                        {!validateRegisterPassword() && (
                            <>
                                <p className={styles.requiredField}>Password is required.</p>
                            </>
                        )}
                    </Form.Group>
                    {allRegisterInputValid.invalidField !== '' ? (
                        <p className={styles.requiredField}>
                            {allRegisterInputValid.invalidField} is a required field. Please fill it in!
                        </p>
                    ) : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUsersModal(false)}>
                        Close
                    </Button>
                    <Button className={styles.button} onClick={validateRegisterOnSubmit}>
                        Add a new user
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Users update modal */}
            <Modal show={showsUsersUpdateModal} onHide={() => setShowUsersUpdateModal(false)} centered>
                <Modal.Title className="p-4">
                    Edit user
                </Modal.Title>
                <Modal.Body>
                <Form.Group controlId="update_name">
                        <Form.Label>Enter your First name</Form.Label>
                        <Form.Control type="text" placeholder="First name" value={updateName}  onChange={e => setUpdateName(e.target.value)}/>
                        {!validateUpdateName() && (
                            <>
                                <p className={styles.requiredField}>First name is required.</p>
                            </>
                        )}
                    </Form.Group>

                    <Form.Group controlId="update_surname" className="mt-4">
                        <Form.Label>Enter your Last name</Form.Label>
                        <Form.Control type="text" placeholder="Last name" value={updateSurname} onChange={e => setUpdateSurname(e.target.value)}/>
                        {!validateUpdateSurname() && (
                            <>
                                <p className={styles.requiredField}>Last name is required.</p>
                            </>
                        )}
                    </Form.Group>
                    {allUpdateInputValid.invalidField !== '' ? (
                        <p className={styles.requiredField}>
                            {allUpdateInputValid.invalidField} is a required field. Please fill it in!
                        </p>
                    ) : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUsersUpdateModal(false)}>
                        Close
                    </Button>
                    <Button className={styles.button} onClick={validateUpdateOnSubmit}>
                        Save user settings
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
