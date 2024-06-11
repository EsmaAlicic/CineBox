export const GetAllMoviesAPI = async (token) => {
    let res = await fetch("http://localhost:8081/wp/movies/get-all-movies", {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": token, "Accept": "application/json" },
    }).then((res) => {
        return res.json();
    });

    return res;
};

export const AddMoviesAPI = async (data, token) => {
    let res = await fetch("http://localhost:8081/wp/movies/add-movie", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": token, "Accept": "application/json" },
        body: JSON.stringify(data, null, 2),
    })
    res = await res.json();
    return res;
};

export const AddCommentAPI = async (data, moviesId, token) => {
    let res = await fetch(`http://localhost:8081/wp/comment/add-comment/${moviesId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": token, "Accept": "application/json"},
        body: JSON.stringify(data, null, 2),
    })
    res = await res.json();
    return res;
};

export const UpdateMoviesAPI =  async (data, token)=>{
    let res = fetch('http://localhost:8081/wp/movies/update-movie', {
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

export const DeleteMoviesAPI = async (moviesId, token) => {
    let res = await fetch(`http://localhost:8081/wp/movies/delete-movie/${moviesId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": token, "Accept": "application/json"}
    })
    res = await res.json();
    return res;
};

export const DeleteCommentAPI = async (commentId, token) => {
    let res = await fetch(`http://localhost:8081/wp/comment/delete-comment/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "Authorization": token, "Accept": "application/json"}
    })
    res = await res.json();
    return res;
};