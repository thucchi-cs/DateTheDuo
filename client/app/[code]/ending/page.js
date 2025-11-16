"use client";
import ws from "../../socket";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import getSocket from "../../socket";
import cat1 from "../../images/cat1.png";
import cat2 from "../../images/cat2.png";
import cat3 from "../../images/cat3.png";
import cat4 from "../../images/cat4.png";
import dateDuo from "../../images/dateDuo.png";
import spotlight from "../../images/spotlight.png";

export default function ending() {
    const images = [cat1.src, cat2.src, cat3.src, cat4.src];
    const ws = getSocket();
    const [stage, setStage] = useState("contestant");
    const [playerID, setPlayerID] = useState(null);
    const [players, setPlayers] = useState([ws]);
    const [winner, setWinner] = useState(0);

    useEffect(() => {
            // Receiving msgs
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
    
                if (data.type === "stage-changed") {
                    setStage(data.stage);
                }
                else if (data.type === "update-players") {
                    setPlayers(data.players);
                }
                else if (data.type === "get-id") {
                    setPlayerID(data.id);
                }
                else if (data.type === "winner") {
                    setWinner(data.winner -1);
                }
            }
    
            return () => ws.onmessage = null;
        }, [])

    if (!playerID) {
        ws.send(JSON.stringify({type:"get-players"}));
        ws.send(JSON.stringify({type:"get-player-id"}));
        ws.send(JSON.stringify({type: "get-winner"}));
    }

    const nextBtn = () => {
        ws.send(JSON.stringify({type: "set-stage", stage:"duo"}));
    }

    return(
        <div className='relative'>
            {stage === "contestant" &&
            <>
                <img className ="absolute object-right z-10 right-34 mt-100" src={images[winner]}></img>
                <p className="absolute text-3xl z-100 mt-[40vh] ml-[10vw] font-[Silkscreen] w-[40vw]">Congratulations, {players[winner].name}! You have won a date!</p>
                <img className="absolute z-0 w-screen h-screen object-cover" src={spotlight.src}></img>
                <button className="absolute font-[Silkscreen] pl-7 pr-7 p-1 rounded w-fit bg-indigo-600 z-20 text-5xl transition duration-150 ease-in-out hover:bg-indigo-500 shadow-x" onClick={nextBtn}>Next!</button>
            </>
            }
            {stage === "duo" &&
            <>
                <img className=" absolute z-10 w-screen h-screen" src={dateDuo.src}></img>
                <p className="absolute z-20 w-60 h-20 indent-4 ml-20 mt-30 font-[Silkscreen]">A brain such as yours is something to be cherished! Tonight, we shall wine and dine by candlelight. It's a pleasure to meet you, {players[winner].name} </p>
            </>
            }


        </div>
    );
}