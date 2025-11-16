"use client";
import { useState, useEffect } from "react";
import getSocket from "@/app/socket";

export default function game() {
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

    return (
        <div>
            {(stage=== "intro") &&
                <div>
                    introing
                    <button onClick={newQuestion}>next</button>
                </div>
            }
            {(stage === "question") &&
                <div>questioning
                    <div>
                        <p>#{questioned.length}</p>
                        <p>{quetionSet[question].q}</p>
                        <button onClick={newQuestion}>New q</button>
                    </div>

                    <div>
                        {players.map((item,index) => (
                            <div key={index}>
                                {!answering &&
                                    <>
                                        {item.buzzed &&
                                            <p className="text-red-600">{item.name}</p>
                                        }
                                        {!item.buzzed &&
                                            <div>
                                                <p>{item.name}</p>
                                                {item.id === playerID &&
                                                    <button onClick={buzz}>:btn:</button>
                                                }
                                            </div>
                                        }
                                    </>
                                }
                                {answering &&
                                     <>
                                        {item.buzzing &&
                                            <div>
                                                <p>{item.name}</p>
                                                {item.id === playerID &&
                                                    <div>
                                                        <input placeholder="Answer..." onChange={(e) => {setAnswer(e.target.value)}}></input>
                                                        <button onClick={sendAnswer}>submit</button>
                                                    </div>
                                                }
                                            </div>
                                        }
                                        {!item.buzzing &&
                                            <p className="text-red-600">{item.name}</p>
                                        }
                                    </>
                                }
                            </div>
                        ))}
                    </div>
                </div>
            }
            {(stage === "answered") &&
                <div>answered:
                    {correct &&
                        <p className="text-green-600">{answered}</p>
                    }
                    {!correct &&
                        <p className="text-red-600">{answered}</p>
                    }
                    <button onClick={react}>Next</button>
                </div>
            }
            {(stage === "reaction") &&
                <div>reacting
                    <p>Duo: {duo}</p>
                    {questioned.length < 10 &&
                        <>
                            {end && 
                                <button onClick={newQuestion}>Next</button>
                            }
                            {!end &&
                                <button onClick={resetQ}>Next</button>
                            }
                        </>
                    }
                    {questioned.length >= 10 &&
                        <>
                            <button>Finish</button>
                        </>
                    }

                </div>
            }
        </div>
    )

}