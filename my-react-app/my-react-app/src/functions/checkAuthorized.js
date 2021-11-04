async function checkAuthorized(path) {
    const url = '/api/authorize'
    return fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            path: path,
        }),
        credentials: 'same-origin'
    }).then(res => res.json())
    .then(data => (data.success))
}

export default checkAuthorized
