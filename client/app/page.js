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
    <div className="min-h-screen font-sans bg-blue-300">
      <div className = "flex flex-col items-center justify-center">
        <div className = "flex w-screen justify-center">
          <img className = "mt-2 w-5/12 h-5/12" src={"/images/title.png"}/>
        </div>
        <div className="flex flex-col justify-center">
          <button className="p-1 bg-indigo-500 rounded-md w-32 ml-18 font-[Silkscreen] text-xl" onClick={createRoom}>New Game</button>
          <div className="mt-7 flex gap-4 mb-5">
            <input placeholder="Room Code" className="font-[Silkscreen] bg-white text-blue-600 p-1 rounded-md w-32" onChange={(e) => {setCodeInput(e.target.value)}}></input>
            <button className= "text-xl p-1 bg-indigo-500 rounded-md font-[Silkscreen]" onClick={(joinRoom)}>Join Game</button>
          </div>
        </div>
      </div>
    </div>
  );
}
