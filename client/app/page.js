"use client";
import {useEffect, useState} from "react";
import getSocket from "./socket";
import { redirect } from "next/navigation";

export default function Home() {
  const [codeInput, setCodeInput] = useState("");
  const ws = getSocket();

  // Socket handling
  useEffect(() => {
    // Receiving msgs
    ws.onmessage = (event) => {
      console.log("two")
      const data = JSON.parse(event.data);

      // After room is created
      if (data.type === "created") {
        console.log("created room");
        const url = `/${data.code}/waiting`;
        redirect(url);
      }
      // After joined room
      else if (data.type === "joined") {
        console.log("joined room");
        const url = `/${data.code}/waiting`;
        redirect(url);
      }
      // Errors
      else if (data.type === "error") {
        console.log(data.msg);
      }
    }

    return () => ws.onmessage = null;
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
      <button onClick={createRoom}>Create room</button>
      <div>
        <input placeholder="Room Code" className="bg-white text-blue-600" onChange={(e) => {setCodeInput(e.target.value)}}></input>
        <button onClick={(joinRoom)}>Join Room</button>
      </div>
    </div>
  );
}
