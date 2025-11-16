"use client";
import { useState, useEffect } from "react";
import getSocket from "@/app/socket";
import { redirect } from "next/navigation";
import { useParams } from "next/navigation";

export default function game() {
    const images = ["/images/cat1.png", "/images/cat2.png", "/images/cat3.png", "/images/cat4.png"];
    const duos = ["/images/angryDuo.PNG", "/images/chadDuo.png", "/images/inloveDuo.PNG", "/images/wowzaDuo.PNG"];

    const quetionSet = [
        {q: "What is the study of language?", a: ["linguistics"]},
        {q: "What U.S. university founded Duolingo?", a: ["carnegie mellon university", "carnegie mellon", "cmu"]},
        {q: "What type of bird is Duo?", a: ["owl"]},
        {q: "True or False: Duolingo was founded in 2015.", a: ["false"]},
        {q: "What is the largest ocean on Earth?", a: ["pacific", "pacific ocean"]},
        {q: "Which of the following is NOT considered a romance language? Italian, French, English, Spanish, Portuguese, Latin?", a: ["english"]},
        {q: "True or False: Duo's full name is “Duo Keyshauna Renee Lingo”", a: ["true"]},
        {q: "What is the largest country by land?", a: ["russia"]},
        {q: "What is the name of the bear from Duolingo?", a: ["falstaff"]},
        {q: "True or False: Duolingo teaches over 40 languages? True of False", a: ["true"]},
        {q: "Which chess piece can move diagonally?", a: ["bishop", "bishops"]},
        {q: "Rogers is the last name of which Scooby-Doo character?", a: ["shaggy"]},
        {q: "Vanessa Hudgens plays which character in High School Musical?", a: ["gabriella montez", "gabriella"]},
        {q: "Duolingo has over 70 million daily users. true/false", a: ["false"]},
    ]

    // Get url params
    const params = useParams();
    const {code} = params;

    const [stage, setStage] = useState("intro");
    const [question, setQuestion] = useState(null);
    const [questioned, setQuestioned] = useState([]);
    const [players, setPlayers] = useState([]);
    const [playerID, setPlayerID] = useState(null);
    const [answering, setAnswering] = useState(false);
    const [answer, setAnswer] = useState("");
    const [answered, setAnswered] = useState("");
    const [correct, setCorrect] = useState(false);
    const [end, setEnd] = useState(false);
    const [duo, setDuo] = useState(null);
    const ws = getSocket();

    // Socket handling
    useEffect(() => {
        // Receiving msgs
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "stage-changed") {
                setStage(data.stage);
            }
            else if (data.type === "question-set") {
                setQuestion(data.qNum);
                setQuestioned(prev => [...prev, data.qNum]);
            }
            else if (data.type === "update-players") {
                setPlayers(data.players);
            }
            else if (data.type === "get-id") {
                setPlayerID(data.id);
            }
            else if (data.type === "buzzed") {
                setAnswering(true);
            }
            else if (data.type === "answered") {
                setAnswered(data.ans);
                setCorrect(data.correct);
            }
            else if (data.type === "reacted") {
                setEnd(data.end);
                setDuo(data.duo);
                setAnswering(false);
                setAnswer("");
            }
            else if (data.type === "ended-all") {
                redirect(`/${code}/ending`);
            }
        }

        return () => ws.onmessage = null;
    }, [])

    if (!playerID) {
        ws.send(JSON.stringify({type:"get-players"}));
        ws.send(JSON.stringify({type:"get-player-id"}));
    }

    const newQuestion = () => {
        ws.send(JSON.stringify({type: "set-question", questioned:questioned, len:quetionSet.length}));
    }

    const buzz = () => {
        ws.send(JSON.stringify({type: "buzz"}));
    }

    const sendAnswer = () => {
        let ans = answer.toLowerCase();
        let correct = quetionSet[question].a.includes(ans);
        ws.send(JSON.stringify({type:"answer", correct:correct, ans:answer}));
    }
    
    const react = () => {
        ws.send(JSON.stringify({type:"react", correct:correct}));
    }

    const resetQ = () => {
        ws.send(JSON.stringify({type:"set-stage", stage:"question"}));
    }

    const endAll = () => {
        ws.send(JSON.stringify({type:"end-all"}));
    }

    return (
        <div>
            {(stage=== "intro") &&
                <div className= "relative">
                    <img className="absolute z-0 w-screen h-screen object-cover" src={"/images/introScreen.png"}></img>
                    <button className ="absolute font-[Silkscreen] p-1 rounded w-fit bg-indigo-600 z-20 text-5xl ml-50 mt-140 transition duration-150 ease-in-out hover:bg-indigo-500 shadow-x" onClick={newQuestion}>Next!</button>
                </div>
            }
            {(stage === "question") &&
                <div>
                    <div className="absolute">
                        <img className="w-screen h-screen object-cover z-100" src={"/images/questionBank.png"}></img>
                    </div>
                    <div className ="relative">
                    
                        <p className="absolute top-0 left-0 mt-50 invisible">#{questioned.length}</p>
                        <p className = "absolute top-50 left-70 font-[Silkscreen] text-5xl mr-40">{quetionSet[question].q}</p>
                    </div>
                    <div>
                        <div className = "flex row-span-2 max-w-screen justify-center px-10">
                            {players.map((item, index) => (
                                <div key={index} className = "w-max flex flex-col text-center font-[Silkscreen] text-3xl items-center">
                                    <img className = "mt-2" src={images[index]}/>
                                    

                                    {!answering &&
                                        <>
                                            {item.buzzed &&
                                                <div className="flex flex-row items-center  mt-80">
                                                    <p className="text-center p-1 w-fit mr-5 text-gray-100 z-100">{item.name}</p>
                                                </div>                                            }
                                            {!item.buzzed &&
                                                <div>
                                                    <div className="flex flex-row items-center mt-80">
                                                        <p className="text-center p-1 w-fit z-100">{item.name}</p>
                                                    </div> 
                                                    {item.id === playerID &&
                                                        <div className="relative">
                                                            <img className="w-[10vw]" src={"/images/buzzer.png"} onClick={buzz} />
                                                        </div>
                                                    }
                                                </div>
                                            }
                                        </>
                                    }
                                    {answering &&
                                        <>
                                            {item.buzzing &&
                                                <div>
                                                    <div className="flex flex-row items-center mt-80">
                                                        <p className="text-center p-1 w-fit z-100">{item.name}</p>
                                                    </div> 
                                                    {item.id === playerID &&
                                                        <div className="relative flex flex-column">
                                                            <input className="text-center p-1 w-[20vw]" placeholder="Answer..." onChange={(e) => {setAnswer(e.target.value)}}></input>
                                                            <button onClick={sendAnswer}>submit</button>                                                        
                                                        </div>
                                                    }
                                                </div>
                                            }
                                            {!item.buzzing &&
                                                <div className="flex flex-row items-center  mt-80">
                                                    <p className="text-center p-1 w-fit mr-5 text-gray-100 z-100">{item.name}</p>
                                                </div>  
                                            }
                                        </>
                                    }
                                    </div>
                                ))}
                        </div>
                    </div>

                </div>
            }
            {(stage === "answered") &&
                <div className="relative">
                    <img className="w-screen h-screen object-cover z-10" src={"/images/questionBank.png"} ></img>
                    <p className="absolute font-[Silkscreen] text-white text-5xl top-40 left-130">answered:</p>
                    {correct &&
                        <p className="absolute font-[Silkscreen] text-green-600 text-8xl top-60 left-130">{answered}</p>
                    }
                    {!correct &&
                        <p className="absolute font-[Silkscreen] text-red-600 text-8xl top-60 left-130">{answered}</p>
                    }
                    <button className ="absolute font-[Silkscreen] bottom-40 right-165 p-1 rounded w-fit bg-indigo-600 z-20 text-9xl transition duration-150 ease-in-out hover:bg-indigo-500 shadow-x" onClick={react}>Next!</button>
                </div>
            }
            {(stage === "reaction") &&
                <div>
                    <div className= "relative">
                        <img className="absolute z-0 w-screen h-screen object-cover" src={"/images/spotlight.png"}></img>
                        <img className="relative z-100 w-[45vw] t-15 ml-[55vw]" src={duos[duo+1]}></img>
                        {questioned.length < 10 &&
                            <>
                                {end && 
                                    <button className ="absolute font-[Silkscreen] p-1 ml-15 rounded w-fit bg-indigo-600 z-20 text-5xl transition duration-150 ease-in-out hover:bg-indigo-500 shadow-x" onClick={newQuestion}>Next</button>
                                }
                                {!end &&
                                    <button className ="absolute font-[Silkscreen] p-1 ml-15 rounded w-fit bg-indigo-600 z-20 text-5xl transition duration-150 ease-in-out hover:bg-indigo-500 shadow-x" onClick={resetQ}>Next</button>
                                }
                            </>
                        }
                        {questioned.length >= 10 &&
                            <>
                                {end && 
                                    <button className ="absolute font-[Silkscreen] p-1 ml-15 rounded w-fit bg-indigo-600 z-20 text-5xl transition duration-150 ease-in-out hover:bg-indigo-500 shadow-x" onClick={endAll}>Finish</button>
                                }
                                {!end &&
                                    <button className ="absolute font-[Silkscreen] p-1 ml-15 rounded w-fit bg-indigo-600 z-20 text-5xl transition duration-150 ease-in-out hover:bg-indigo-500 shadow-x" onClick={resetQ}>Next</button>
                                }
                        </>
                        }
                    </div>

                </div>
            }
        </div>
    )

}