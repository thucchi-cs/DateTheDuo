"use client";
import {useRef, useEffect, useState} from "react";
import cat1 from "../images/cat1.png";
import cat2 from "../images/cat2.png";
import cat3 from "../images/cat3.png";
import cat4 from "../images/cat4.png";
export default function Home(){
    return(

        <div className = "flex flex-col max-w-screen min-h-screen justify-center items-center bg-blue-300">
        <button className = "pl-10 pr-10 p-2 rounded-md bg-indigo-600 mt-20 mb-25">Start!</button>
        <div className = "flex row-span-2 max-w-screen justify-center">
            <img className = "mt-2 w-3/13 h-3/12" src={cat1.src}/>
            <img className = "mt-2 w-3/13 h-3/12" src={cat2.src}/>
            <img className = "mt-2 w-3/13 h-3/12" src={cat3.src}/>
            <img className = "mt-2 w-3/13 h-3/12" src={cat4.src}/>
        {/* <div className="flex flex-col justify-center items-center"> */}
            {/* <p>Player 1</p>
            <p>Player 2</p>
            <p>Player 3</p>
            <p>Player 4</p>
        </div> */}
        
        </div>
        </div>

    );
}