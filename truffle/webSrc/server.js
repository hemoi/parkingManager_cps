const http = require('http');
const fs = require('fs');

http.createServer((req,res) => {
    fs.readFile('./sample.html', (err,data) => {
        if(err) {
            throw err;
        }
        res.end('');
    });
}).listen(8081, () => {
    console.log('8081 waiting')
});

// server.on('listening', () => {
//     console.log('8080 waiting');
// });

// server.on('error', (error) => {
//     console.error(error);
// });