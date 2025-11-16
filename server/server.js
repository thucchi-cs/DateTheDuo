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
            socket.id = session[code].size;

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
                    socket.id = session[code].size;
    
                    socket.send(JSON.stringify({type: "joined", code: code, num: session[code].size}));
    
                    for (const s of session[code]) {
                        s.send(JSON.stringify({type:"update-players", players:[...session[socket.code]], num:session[socket.code].size}));
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
        // Get players in room
        else if (type === "get-players") {
            if (socket.code) {
                console.log(`getting plauers ${socket.id}`)
                socket.send(JSON.stringify({type:"update-players", players:[...session[socket.code]], num:session[socket.code].size}));
            }
            // Errored not in room
            else {
                socket.send(JSON.stringify({type:"error", msg: "Player not in room"}));
            }
        }
        // Get player's id
        else if (type === "get-player-id") {
            console.log(`getting id ${socket.id}`)
            if (socket.code) {
                socket.send(JSON.stringify({type:"get-id", id:socket.id}));
            }
            // Errored not in room
            else {
                socket.send(JSON.stringify({type:"error", msg: "Player not in room"}));
            }
        }

    })

    // Close socket when disconnected
    socket.on("close", () => {
        console.log("disconnected");
        if (socket.code) {
            session[socket.code]?.delete(socket);
            // Notify others
            for (const s of session[socket.code]) {
                s.send(JSON.stringify({type:"update-players", players:[...session[socket.code]], num:session[socket.code].size}));
            }
        }
    })
})

// Open server
const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0");