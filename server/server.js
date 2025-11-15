// Imports
const http = require("http");
const webSocket = require("ws");

// Server
const server = http.createServer();
const wss = new webSocket.Server({server});

// Globals
let session = {}

// New connection
wss.on("connection", (socket) => {
    console.log("New COnnection!");

    // When received data
    socket.on("message", (msg) => {
        // Data
        const data = JSON.parse(msg);
        const {type} = data;

        // Create room
        if (type === "create-room") {
            console.log("Created room");

            // Generate and save room code
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            session[code] = new Set([socket]);
            socket.code = code;

            // Send to client
            socket.send(JSON.stringify({type: "created", code: code, num: session[code].size}))
        }
        // Join room
        else if (type === "join-room") {
            console.log("Joined room");
            
            // Join room w code
            const {code} = data;
            if (session[code]) {
                // Add player if not maxed
                if (session[code].size <= 3) {
                    session[code].add(socket);
                    socket.code = code;
    
                    socket.send(JSON.stringify({type: "joined", code: code, num: session[code].size}));
    
                    for (const s of session[code]) {
                        s.send(JSON.stringify({type:"update-num", num:session[code].size}));
                    }
                }
                // Errored too many people
                else {
                    socket.send(JSON.stringify({type: "error", msg:"Too many people"}))
                }

            }
            // Errorred code
            else {
                socket.send(JSON.stringify({type:"error", msg:"Invalide room code"}));
            }
        }

    })

    // Close socket when disconnected
    socket.on("close", () => {
        console.log("disconnected");
    })
})

// Open server
const PORT = process.env.PORT || 8080;
server.listen(PORT);