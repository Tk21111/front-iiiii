import { useEffect } from "react";
import { useGetHowQuery } from "./NoteApiSlice";

const list = {'ไก่' : ['กะเพราไก่' , 'ไก่กะเพรา' , 'มะละไก่'] , 'ปลา' : ['ปลากระพง' , 'ปลาชุบแป้งทอด' , 'กะเพราปลา'] , 'sa' : ['gh','ghj'] , "test" : ["fixbug" , "fixbug1" , "fixbug2"]}
const listNew = [
    [['ไก่' ,'ข้าว','กระเพรา'], [{name : 'กะเพราไก่'} , {name : 'ไก่กะเพรา'}]],
    [['ปลา' ,'ข้าว','กระเพรา'], [{name : 'ปลาปลา'} , {name : 'ปลา'}]],
    ]

const listHowMeat = [
    ['ไก่', {des : 'wow'} , ] , ['ปลา' , {des : 'ws'}]
]
const listHowVeg = [
    [ 'ผักบุ่ง', {des : 'wow'}] 
]
export {listNew , listHowMeat , listHowVeg};


