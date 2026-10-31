'use client';
import {useState} from 'react';
import {Copy,Check} from 'lucide-react';
export function CopyButton({text}){const [done,setDone]=useState(false);async function copy(){try{await navigator.clipboard.writeText(text);setDone(true);setTimeout(()=>setDone(false),1600)}catch{setDone(false)}}return <button className="poster-copy-full" onClick={copy}>{done?<Check size={16}/>:<Copy size={16}/>} {done?'Copied':'Copy full prompt'}</button>}
