"use client";
import {useEffect, useState} from "react";
import getSocket from "./socket";

export default function Home() {
  const [codeInput, setCodeInput] = useState("");
  const [playersNum, setPlayersNum] = useState(0);
  const [code, setCode] = useState(null);
  const ws = getSocket();

  // Socket handling
  useEffect(() => {
    // Receiving msgs
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // After room is created
      if (data.type === "created") {
        console.log("created room");
        setCode(data.code);
        setPlayersNum(data.num);
      }
      // After joined room
      else if (data.type === "joined") {
        console.log("joined room");
        setCode(data.code);
        setPlayersNum(data.num);
      }
      // Update number of players
      else if (data.type === "update-num") {
        setPlayersNum(data.num);
      }
      // Errors
      else if (data.type === "error") {
        console.log(data.msg);
      }
    }

    return () => ws.close()
  }, [])

  const createRoom = () => {
    console.log("creating room");
    ws.send(JSON.stringify({type: "create-room"}));
  }

  const joinRoom = () => {
    console.log("joining room");
    ws.send(JSON.stringify({type:"join-room", code:codeInput}));
  }

  return (
    <div className="min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {!code && 
        <>
          <button onClick={createRoom}>Create room</button>
          <div>
            <input placeholder="Room Code" className="bg-white text-blue-600" onChange={(e) => {setCodeInput(e.target.value)}}></input>
            <button onClick={(joinRoom)}>Join Room</button>
          </div>
        </>}

      {code &&
        <>
          <h1>{code}</h1>
          <p>Number of players in room: {playersNum}</p>
        </>}
    </div>
  );
}
