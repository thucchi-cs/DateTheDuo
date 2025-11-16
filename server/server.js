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
            socket.name = `Player ${socket.id}`;

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
                    socket.name = `Player ${socket.id}`;
    
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
        // Change player's name
        else if (type === "edit-name") {
            socket.name = data.name;
            for (const s of session[socket.code]) {
                s.send(JSON.stringify({type:"update-players", players:[...session[socket.code]], num:session[socket.code].size}));
            }
        }
        // Start game from waiting room
        else if (type === "start") {
            console.log("starting")
            for (const s of session[socket.code]) {
                s.buzzed = false;
                s.buzzing = false;
                s.score = 0;
                s.send(JSON.stringify({type:"started"}));
            }
        }
        // Randomize question
        else if (type === "set-question") {
            const allowed = [];
            const excluded = new Set(data.questioned)
            for (let i=0; i<data.len; i++) {
                if (!excluded.has(i)) {
                    allowed.push(i);
                }
            }
            const randomized = allowed[Math.floor(Math.random() * allowed.length)];
            
            for (const s of session[socket.code]) {
                s.buzzed = false;
                s.buzzing = false;
            }

            for (const s of session[socket.code]) {
                s.send(JSON.stringify({type: "question-set", qNum: randomized}));
                s.send(JSON.stringify({type: "stage-changed", stage:"question"}));
                s.send(JSON.stringify({type:"update-players", players:[...session[socket.code]], num:session[socket.code].size}));
            }
        }
        // Player buzz
        else if (type === "buzz") {
            socket.buzzing = true;
            socket.buzzed = true;
            for (const s of session[socket.code]) {
                s.send(JSON.stringify({type: "buzzed"}));
                s.send(JSON.stringify({type:"update-players", players:[...session[socket.code]], num:session[socket.code].size}));
            }
        }
        // Player answer
        else if (type === "answer") {
            for (const s of session[socket.code]) {
                s.send(JSON.stringify({type:"answered", ans:data.ans, correct:data.correct}));
                s.send(JSON.stringify({type:"stage-changed", stage:"answered"}));
            }
        }
        // Duo react to answer
        else if (type === "react") {
            let end = true;
            for (const s of session[socket.code]) {
                s.buzzing = false;
                end = end && s.buzzed;
            }
            let duo;
            if (data.correct) {
                duo = Math.floor(Math.random() * 3);
            } else {
                duo = -1;
            }
            for (const s of session[socket.code]) {
                s.send(JSON.stringify({type:"reacted", end:end||data.correct, duo:duo}));
                s.send(JSON.stringify({type:"stage-changed", stage:"reaction"}));
                s.send(JSON.stringify({type:"update-players", players:[...session[socket.code]], num:session[socket.code].size}));
            }
        }
        // Change state
        else if (type === "set-stage") {
            for (const s of session[socket.code]) {
                s.send(JSON.stringify({type:"stage-changed", stage:data.stage}));
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