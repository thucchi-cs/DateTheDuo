"use client";
import {useEffect, useState} from "react";
import { useParams } from "next/navigation";
import getSocket from "../../socket";

export default function waitingRoom() {
    // Get url params
    const params = useParams();
    const {code} = params;

    const ws = getSocket();
    const [playersNum, setPlayersNum] = useState(0);
    const [playerID, setPlayerID] = useState(null);
    const [players, setPlayers] = useState([]);
    
    useEffect(() => {
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "update-num") {
                setPlayersNum(data.num);
            }
            else if (data.type === "update-players") {
                setPlayersNum(data.num);
                setPlayers(data.players);
                console.log(data.players)
            }
            else if (data.type === "get-id") {
                setPlayerID(data.id);
            }
        }
        
        return () => ws.onmessage = null;
    }, []);
    if (!playerID) {
        ws.send(JSON.stringify({type:"get-players"}));
        ws.send(JSON.stringify({type:"get-player-id"}));
    }

    return (
        <>
            <p>what</p>
            <p>sup</p>
            <p>{code}</p>
            <p>Number of players: {playersNum}</p>
            <p>Player ID: {playerID}</p>
            {players.map((item, index) => (
                <li key={index}>player {item.id}</li>
            ))}
        </>
    )
}