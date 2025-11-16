"use client";
import {useEffect, useState} from "react";
import { useParams } from "next/navigation";
import getSocket from "../../socket";
import cat1 from "../../images/cat1.png";
import cat2 from "../../images/cat2.png";
import cat3 from "../../images/cat3.png";
import cat4 from "../../images/cat4.png";

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
    const images = [cat1.src, cat2.src, cat3.src, cat4.src];
    
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
        <div className = "flex flex-col max-w-screen min-h-screen justify-center items-center bg-blue-300">
            <p className="text-sm font-[Silkscreen]">Code: {code}</p>
            <button className = "pl-10 pr-10 p-2 rounded-md bg-indigo-600 mt-20 mb-25 text-5xl">Start!</button>
            <div className = "flex row-span-2 max-w-screen justify-center px-10">
                {players.map((item, index) => (
                    <div key={index} className = "w-max flex flex-col text-center items-center">
                        <img className = "mt-2" src={images[index]}/>
                        {(editName && (item.id === playerID)) &&
                            <>  
                                <input className="text-center p-1 border rounded w-fit mr-5" value={name} onChange={(e) => {setName(e.target.value)}}></input>
                                <button onClick={saveName}>✓</button>
                            </>
                        }
                        {!(editName && (item.id === playerID)) &&
                            <>
                                <p className="text-center p-1 w-fit mr-5">{item.name}</p>
                                {item.id === playerID && 
                                    <button onClick={openEditName}>:edit:</button>
                                }
                            </>
                        }
                    </div>
                ))}
            </div>        
        </div>
    )
}