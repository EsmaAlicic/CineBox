export const LoginAPI = async (data) => {
    let res = await fetch("http://localhost:8081/wp/user/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data, null, 2),
    });

    res = await res.json();
    return res;
};

export const RegisterAPI = async (data) => {
    let res = await fetch("http://localhost:8081/wp/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data, null, 2),
    })
    res = await res.json();
    return res;
};