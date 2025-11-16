"use client";
import {useRef, useEffect, useState} from "react";
import cat1 from "../images/cat1.png";
import cat2 from "../images/cat2.png";
import cat3 from "../images/cat3.png";
import cat4 from "../images/cat4.png";
export default function Home(){
    return(
        <div className = "flex flex-wrap row-span-2 max-w-screen justify-center">
        <button className = "p-2 rounded-md bg-indigo-600">Start!</button>
        <img className = "mt-2 w-5/12 h-5/12" src={cat1.src}/>
        <img className = "mt-2 w-5/12 h-5/12" src={cat2.src}/>
        <img className = "mt-2 w-5/12 h-5/12" src={cat3.src}/>
        <img className = "mt-2 w-5/12 h-5/12" src={cat4.src}/>
        
        </div>

    );
}