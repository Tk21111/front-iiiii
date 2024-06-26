import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllNoteUserMutation } from "./NoteApiSlice";
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';

const BuyExcerpt = ({ i }) => {
    const username = useSelector(selectCurrentUser);

    const [getAllNoteUser] = useGetAllNoteUserMutation();

    //obj key = _id 
    const [note, setNote] = useState(null);
    const [set , setSet] =useState(false);

    useEffect (()=> {
        if(!note){
            setNote(i);
            setSet(true)
        }
    }, [i,note])

    //key with tag
    let key = note ? Object.keys(note) : 0;

    let tag;
    if (Array.isArray(key)){
        tag = note.tag
        key.pop();
    
    if (key.length === 0){
        key = 'None found'
    }
    }
    
    let content = {};
    let countEn = 0;
    let countExpEn = 0;
    let suggestion = 0;

    if ( key.length >= 1){
        //get entities of _id
        //get all of count and countExp
        
        for (let f of key){
            try {
                let entities = note[f]
                let objCC = {}

                countEn += entities.count ? entities.count : 0;
                objCC['count'] = entities.count ? entities.count : 0;
                countExpEn += entities.countExp ? entities.countExp : 0;
                objCC['countExp'] = entities.countExp ? entities.countExp : 0;
                
                content[entities.text] = objCC
            } catch (err){
                console.log(err)
            }
            
        }

    //obj {key : count , countExp}
    

        //setCount(countEn)
        //setCountExp(countExpEn)

        //logic something
        if (countEn > countExpEn*999){
            suggestion = 'as much as you want'
        } else if (countEn > countExpEn){
            suggestion = "Maybe think again"
        } else if (countEn === countExpEn){
            suggestion = "I don't think u need this as much"
        } 
    } else {
        content = 'Not found'
    }


    if (!note) {
        return <p>Loading...</p>;
    }
    return (
        <article>
            <h2>{tag}</h2>
            <p>{JSON.stringify(content)}</p>
            <p>{'Buy ; ' + countEn + '   :   ' + 'Expire ; ' +countExpEn}</p>
            <p>{suggestion}</p>
        </article>
    );
};

export default BuyExcerpt;
