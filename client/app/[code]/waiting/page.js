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
    const [editName, setEditName] = useState(false);
    const [name, setName] = useState("");
    
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

    const openEditName = () => {
        setEditName(true);
        setName(players[playerID-1].name);
    }

    const saveName = () => {
        setEditName(false);
        ws.send(JSON.stringify({type:"edit-name", name:name}));
    }

    return (
        <>
            <p>what</p>
            <p>sup</p>
            <p>{code}</p>
            <p>Number of players: {playersNum}</p>
            <p>Player ID: {playerID}</p>
            {players.map((item, index) => (
                <div key={index}>
                    {(editName && (item.id === playerID)) &&
                        <>  
                            <input className="bg-white text-blue-800" value={name} onChange={(e) => {setName(e.target.value)}}></input>
                            <button onClick={saveName}>✓</button>
                        </>
                    }
                    {!(editName && (item.id === playerID)) &&
                        <>
                            <p>{item.name}</p>
                            {item.id === playerID && 
                                <button onClick={openEditName}>:edit:</button>
                            }
                        </>
                    }
                </div>
            ))}
        </>
    )
}