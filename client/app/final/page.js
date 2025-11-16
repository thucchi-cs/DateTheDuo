"use client";
import {useEffect, useState} from "react";
import { useParams } from "next/navigation";
import getSocket from "../socket";
import cat1 from "../images/cat1.png";
import cat2 from "../images/cat2.png";
import cat3 from "../images/cat3.png";
import cat4 from "../images/cat4.png";
import dateDuo from "../images/dateDuo.png";
import spotlight from "../images/spotlight.png";
export default function Home(){
    return(
        <div className='relative'>
            <img className ="absolute object-right z-10 right-34 mt-100" src={cat1.src}></img>
            <img className="absolute z-0 w-screen h-screen object-cover" src={spotlight.src}></img>
            <button className="absolute font-[Silkscreen] pl-7 pr-7 p-1 right-350 mt-200 rounded w-fit bg-indigo-600 z-20 text-5xl transition duration-150 ease-in-out hover:bg-indigo-500 shadow-x">Next!</button>


        </div>
    );
}