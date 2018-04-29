const http = require('http');
const url = require('url');


const server = http.createServer((req, res) => {
    const _url = url.parse(req.url);
    if (_url.path.indexOf('monitor') > -1) {
        res.end('ok');
    } else {
        res.end('8083');
    }
})

server.listen(8083, () => {
    http.get('http://localhost:8080/api/register?id=8083', (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => {rawData += chunk});
        res.on('end', () => {
            console.log(rawData)
        })
    });
});