"use client";

let ws;

export default function getSocket() {
    if (ws && (ws.readyState !== ws.CLOSED)) {
        return ws;
    }

    // connect
    ws = new WebSocket("ws://localhost:8080");
    // ws = new WebSocket("wss://datetheduo.onrender.com/");
    console.log("hi")

    return ws;
};