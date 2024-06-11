import React, { useState, useEffect } from 'react'
import Sidebar from '../partials/sidebar/Sidebar'
import styles from './profile.module.css'
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/actions/Actions";
import { GetCurrentUserAPI, UpdateUserAPI, ChangeUsersPasswordAPI } from "../../services/UserService"
import { useNavigate } from "react-router-dom";
import { Button, Form, Modal } from 'react-bootstrap';
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

export default function ProfilePage() {
    const navigate = useNavigate();
    const [currentId, setCurrentId] = useState("")
    const [currentName, setCurrentName] = useState("")
    const [currentSurname, setCurrentSurname] = useState("")
    const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const dispatch = useDispatch();
    const info = useSelector((state) => {
        return state.authenticateToken;
    });

    useEffect(() => {
        async function fetchMyAPI() {
            await GetCurrentUserAPI(info.authenticateInfo.token).then(res => {
                setCurrentId(res.id)
                setCurrentName(res.name)
                setCurrentSurname(res.surname)
                dispatch(setUser(res));
            })
        }

        if(!info.authenticateInfo.hasOwnProperty('token')) {
            navigate('/');
        }
        else {
            if(info.authenticateInfo.role !== 'GUEST') {
                fetchMyAPI();
            } else {
                navigate('/');
            }
        }
    }, [info])

    const currentFormFilled = [
        { id:"current_name", filledName: "Ime", valid: false },
        { id:"current_surname", filledName: "Prezime", valid: false },
    ];

    const passwordChangeFormFilled = [
        { id:"old_password", filledName: "Stara šifra", valid: false },
        { id:"new_password", filledName: "Nova šifra", valid: false },
    ];

    const validateCurrentName = () => {
        if (currentName.length < 3) {
            currentFormFilled[0].valid = false;
          return false;
        } else {
          currentFormFilled[0].valid = true;
          return true;
        }
    };

    const validateCurrentSurname = () => {
        if (currentSurname.length < 3) {
          currentFormFilled[1].valid = false;
          return false;
        } else {
          currentFormFilled[1].valid = true;
          return true;
        }
    };

    const validateOldPassword = () => {
        if (oldPassword.length < 6) {
            passwordChangeFormFilled[0].valid = false;
          return false;
        } else {
          passwordChangeFormFilled[0].valid = true;
          return true;
        }
    };

    const validateNewPassword = () => {
        if (newPassword.length < 6) {
          passwordChangeFormFilled[1].valid = false;
          return false;
        } else {
          passwordChangeFormFilled[1].valid = true;
          return true;
        }
    };

    const [allCurrentInputValid, setAllCurrentInputValid] = useState({
        valid: false,
        invalidField: "",
    });

    const [allPasswordChangeInputValid, setAllPasswordChangeInputValid] = useState({
        valid: false,
        invalidField: "",
    });

    const updateProfile = async () => {
        var countValidData = 0;
        currentFormFilled.slice().reverse().forEach((item) => {
            if (!item.valid) {
                setAllCurrentInputValid({ valid: false, invalidField: item.filledName });
                document.getElementById(item.id).focus();
                countValidData--;
            }
            countValidData++;
          });
        if (countValidData === 2) {
            setAllCurrentInputValid({ valid: true, invalidField: "" });
            let updateData = {
                id: currentId,
                name: currentName,
                surname: currentSurname
            }
            UpdateUserAPI(updateData, info.authenticateInfo.token)
            Toast.fire({
                icon: "success",
                title: "User data successfully updated!",
            });
        }
    }

    const changePassword = async () => {
        var countValidData = 0;
        passwordChangeFormFilled.slice().reverse().forEach((item) => {
            if (!item.valid) {
                setAllPasswordChangeInputValid({ valid: false, invalidField: item.filledName });
                document.getElementById(item.id).focus();
                countValidData--;
            }
            countValidData++;
          });
        if (countValidData === 2) {
            setAllPasswordChangeInputValid({ valid: true, invalidField: "" });
            const passwordChangeResponse = await ChangeUsersPasswordAPI(oldPassword, newPassword, info.authenticateInfo.token);
            if(!passwordChangeResponse.hasOwnProperty('status')) {
                setShowPasswordChangeModal(false)
                setOldPassword("")
                setNewPassword("")
                Toast.fire({
                    icon: "success",
                    title: "User password successfully updated!",
                });
            } else {
                Toast.fire({
                    icon: "error",
                    title: "Incorrectly entered data!",
                });
            } 
        }
    }

    return (
        <div className={styles.myProfile}>
            <Sidebar/>
            <div className="container">
                <div className={styles.textBox}>
                    <h2><strong>Profile settings</strong></h2>
                </div>
                <div className={styles.profileContainer}>
                    <Form.Group controlId='current_name'>
                        <Form.Label><strong>Enter your First name</strong></Form.Label>
                        <Form.Control type="text" placeholder="First name" value={currentName}  onChange={e => setCurrentName(e.target.value)}/>
                        {!validateCurrentName() && (
                            <>
                                <p className={styles.requiredField}>First name is required.</p>
                            </>
                        )}
                    </Form.Group>
                    <Form.Group controlId='current_surname' className="mt-4">
                        <Form.Label><strong>Enter your Last name</strong></Form.Label>
                        <Form.Control type="text" placeholder="Last name" value={currentSurname} onChange={e => setCurrentSurname(e.target.value)}/>
                        {!validateCurrentSurname() && (
                            <>
                                <p className={styles.requiredField}>Last name is required.</p>
                            </>
                        )}
                    </Form.Group>
                    {allCurrentInputValid.invalidField !== '' ? (
                        <p className={styles.requiredField}>
                            {allCurrentInputValid.invalidField} is a required field. Please fill it in!
                        </p>
                    ) : null}
                    <Form.Group className="mt-4">
                        <Button variant="secondary" onClick={() => setShowPasswordChangeModal(true)}>
                            Change password
                        </Button>
                    </Form.Group>
                    <Form.Group className="mt-4">
                        <Button className={styles.saveButton} onClick={updateProfile}>
                            Save changes
                        </Button>
                    </Form.Group>
                </div>
            </div>

            {/* Password change modal */}
            <Modal show={showPasswordChangeModal} onHide={() => setShowPasswordChangeModal(false)} centered>
                <Modal.Title className="p-4">
                Change user password
                </Modal.Title>
                <Modal.Body>
                <Form.Group controlId="old_password">
                        <Form.Label>Enter the old password</Form.Label>
                        <Form.Control type="password" placeholder="Old Password" value={oldPassword}  onChange={e => setOldPassword(e.target.value)}/>
                        {!validateOldPassword() && (
                            <>
                                <p className={styles.requiredField}>Entering the old password is required.</p>
                            </>
                        )}
                    </Form.Group>

                    <Form.Group controlId="new_password" className="mt-4">
                        <Form.Label>Enter the new password</Form.Label>
                        <Form.Control type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
                        {!validateNewPassword() && (
                            <>
                                <p className={styles.requiredField}>Entering the new password is required.</p>
                            </>
                        )}
                    </Form.Group>
                    {allPasswordChangeInputValid.invalidField !== '' ? (
                        <p className={styles.requiredField}>
                            {allPasswordChangeInputValid.invalidField} is a required field. Please fill it in!
                        </p>
                    ) : null}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPasswordChangeModal(false)}>
                        Close
                    </Button>
                    <Button className={styles.button} onClick={changePassword}>
                        Update password
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
