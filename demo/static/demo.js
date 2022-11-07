function runCode() {
    let code = document.getElementById('config').value;

    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: code
    };
    fetch('http://localhost:3005/api/addSync', options).then(function (resp) {
        console.log(resp.body);
    });
}
