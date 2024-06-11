export const GetCurrentUserAPI = async (token) => {
    let res = await fetch("http://localhost:8081/wp/user/get-current-user", {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": token, "Accept": "application/json" },
    }).then((res) => {
        return res.json();
    });

    return res;
};

export const GetAllUsersAPI = async (token) => {
    let res = await fetch("http://localhost:8081/wp/user/get-all-users", {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": token, "Accept": "application/json" },
    }).then((res) => {
        return res.json();
    });

    return res;
};

export const ActivateUserAPI =  async (token, userId)=>{
    let res = fetch(`http://localhost:8081/wp/user/activate-user/${userId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Authorization': token,
            'Content-Type': 'application/json'
        },
    }).then(response => {
        return response.json()
    });

    return res;
}

export const DeactivateUserAPI =  async (token, userId)=>{
    let res = fetch(`http://localhost:8081/wp/user/deactivate-user/${userId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Authorization': token,
            'Content-Type': 'application/json'
        },
    }).then(response => {
        return response.json()
    })

    return res;
}

export const UpdateUserAPI =  async (data, token)=>{
    let res = fetch('http://localhost:8081/wp/user/update-user', {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Authorization': token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    }).then(response => {
        return response.json()
    });
    
    return res;
}

export const ChangeUsersPasswordAPI =  async (oldPassword, newPassword, token)=>{
    let res = fetch(`http://localhost:8081/wp/user/change-current-users-password/${oldPassword}/${newPassword}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Authorization': token,
            'Content-Type': 'application/json'
        },
    }).then(response => {
        return response.json()
    })

    return res;
}