"use client";
import {useEffect, useState} from "react";
import { useParams } from "next/navigation";
import getSocket from "../socket";
import dateDuo from '../images/dateDuo.png';
export default function Home(){
    return(
        <div className="relative">
            <img className=" absolute z-10 w-screen h-screen" src={dateDuo.src}></img>
            <p className="absolute z-20 w-60 h-20 indent-4 ml-20 mt-30 font-[Silkscreen]">A brain such as yours is something to be cherished! Tonight, we shall wine and dine by candlelight. It's a pleasure to meet you, </p>
        </div>
    );

}