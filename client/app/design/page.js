"use client";
import {useRef, useEffect, useState} from "react";
import cat1 from "../images/cat1.png";
import cat2 from "../images/cat2.png";
import cat3 from "../images/cat3.png";
import cat4 from "../images/cat4.png";
export default function Home(){
    return(

        <div className = "flex flex-col max-w-screen min-h-screen justify-center items-center bg-blue-300">
            <button className = "pl-10 pr-10 p-2 rounded-md bg-indigo-600 mt-20 mb-25 text-5xl">Start!</button>
            <div className = "flex row-span-2 max-w-screen justify-center px-10">
                <div className = "w-max flex flex-col text-center items-center">
                    <img className = "mt-2" src={cat1.src}/>
                    <input className="text-center p-1 border rounded w-fit mr-5"></input>
                </div>
                <div className = "w-max flex flex-col text-center items-center">
                    <img className = "mt-2" src={cat2.src}/>
                    <input className="text-center p-1 border rounded w-fit"></input>
                </div>
                <div className = "w-max flex flex-col text-center items-center">
                    <img className = "mt-2"src={cat3.src}/>
                    <input className = "text-center p-1 border rounded w-fit"></input>
                </div>
                <div className ="w-max flex flex-col text-center items-center">
                    <img className = "mt-2" src={cat4.src}/>
                    <input className = "text-center p-1 border rounded w-fit"></input>
                </div>


            </div>
        
        </div>

    );
}