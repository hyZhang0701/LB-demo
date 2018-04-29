const http = require('http');
const url = require('url');

let vmList = [];

let currentVmIndex = 0;

const server = http.createServer();

function checkUp() {
    setInterval(() => {
        if (vmList.length) {
            for (let vm of vmList) {
                http.get(`http://localhost:${vm}/monitor`, (res) => {
                    res.setEncoding('utf8');
                    let rawData = '';
                    res.on('data', (chunk) => {rawData += chunk});
                    res.on('end', () => {
                        if (rawData === 'ok') {
                            console.log(`vm ${vm} is alive`);
                        }
                    })
                })
                .on('error', (e) => {
                    console.log(`vm ${vm} is dead`);
                    let index = vmList.indexOf(vm);
                    if (index > -1) {
                        vmList.splice(index,1);
                    }
                })
            }
        } else {
            console.log('no vm');
        }
    },2000)
}

server.on('request', (request, response) => {
    const _url = url.parse(request.url);
    if (_url.path.indexOf('register') > -1) {
        let query = _url.query;
        let vmId = query.split('=')[1];
        if (vmList.indexOf(vmId) === -1) {
            vmList.push(vmId);
        }
        response.end('register success')
    } else {
        let len = vmList.length;
        if (len) {
            currentVmIndex = ++currentVmIndex % len;
            http.get(`http://localhost:${vmList[currentVmIndex]}`, (res) => {
                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => {rawData += chunk});
                res.on('end', () => {
                    response.end(rawData);
                })
            })
        } else {
            response.writeHead(404);
            response.end('Not Found');
        }
    }
})

server.listen(8080, () => {
    checkUp();
});