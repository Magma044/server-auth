const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const hostname = '127.0.0.1';
const port = 3000;

const users = {
    "admin":"8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", //admin
    "user":"5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", //password
    "user2":"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4" //1234
}

function hashPassword(password){
    return crypto.createHash("sha256").update(password).digest("hex");
}

function requestHandler(req, res) {
    if(req.url == "/"){
        const filepath = path.join(__dirname,"index.html");
        fs.readFile(filepath, (err,data) => {
            if(err){
                res.writeHead(404, {"Content-Type":"text/plain"});
                res.end("Pagina non trovata");
            }
            else{
                res.writeHead(200, {"Content-Type":"text/html"});
                res.end(data);
            }
        });
    }

    else if(req.url == "/style.css"){
        const filepath = path.join(__dirname,"style.css");
        fs.readFile(filepath, (err,data) => {
            if(err){
                res.writeHead(404, {"Content-Type":"text/plain"});
                res.end("Pagina non trovata");
            }
            else{
                res.writeHead(200, {"Content-Type":"text/css"});
                res.end(data);
            }
        });       
    }

    else if(req.url.startsWith("/login")){
        const url = new URL(req.url, `http://${req.headers.host}`);
        const username = url.searchParams.get("username");
        const password = hashPassword(url.searchParams.get("password"));

        if(users[username] && users[username] === password){
            res.writeHead(200, {"Content-Type":"text/plain"});
            res.end(`Login effettuato come ${username}`);
        }
        else{
            res.writeHead(401, {"Content-Type":"text/plain"});
            res.end(`Username o password non corretti`);
        }
    }

    else{
        res.writeHead(404, {"Content-Type":"text/plain"});
        res.end("Pagina non trovata");    
    }
}

const server = http.createServer(requestHandler);

server.listen(port, hostname, () => {
  console.log(`Server in esecuzione a http://${hostname}:${port}/`);
});