"use client";
import title from "./images/title.png";
import {useRef, useEffect, useState} from "react";

export default function Home() {
  const ws = useRef(null);
  const [code, setCode] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [playersNum, setPlayersNum] = useState(0);

  // COnnect to server
  useEffect(() => {
    // connect
    // ws.current = new WebSocket("ws://localhost:8080");
    ws.current = new WebSocket("wss://datetheduo.onrender.com/");

    // Receiving msgs
    ws.current.onmessage = (event) => {
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

    return () => ws.current.close()
  }, [])

  const createRoom = () => {
    console.log("creating room");
    ws.current.send(JSON.stringify({type: "create-room"}));
  }

  const joinRoom = () => {
    console.log("joining room");
    ws.current.send(JSON.stringify({type:"join-room", code:codeInput}));
  }

  return (
    <div className="min-h-screen font-sans bg-blue-300">
        <div className = "flex flex-col items-center justify-center">
      {!code && 
        <>
          <div className = "flex w-screen justify-center">
          <img className = "mt-2 w-5/12 h-5/12" src={title.src}/>
          </div>
          <div className="flex flex-col justify-center">
          <button className="p-1 bg-indigo-500 rounded-md w-32 ml-20" onClick={createRoom}>Create room</button>
          <div className="mt-7 flex gap-4 mb-5">
            <input placeholder="Room Code" className="bg-white text-blue-600 p-1 rounded-md " onChange={(e) => {setCodeInput(e.target.value)}}></input>
            <button className= "p-1 bg-indigo-500 rounded-md" onClick={(joinRoom)}>Join Room</button>
          </div>
          </div>
        </>}

      {code &&
        <>
          <h1 className="text-lg">{code}</h1>
          <p>Number of players in room: {playersNum}</p>
        </>}
        </div>
    </div>
  );
}
