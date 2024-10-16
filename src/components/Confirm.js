import React from "react";
import ReactDom from 'react-dom'
import { Link, useNavigate } from "react-router-dom";
import { useDonatelocaMutation } from "../features/loca/LocaApiSlice";



export default function Confirm({link , open , onCloseConfirm ,data}) {

    const navigate = useNavigate();
    const [donate , {isLoading : isDonating , isError : donateErr}] = useDonatelocaMutation();

    const onDonateClicked = async (e) => {
        e.preventDefault();
        if (data?.id) {
            try {
                const response = await donate({ id: data?.id }).unwrap();
                onCloseConfirm();
                
                // Assuming response was successful, navigate to '/location'
                navigate(`/getuser/${data.user}`);
    
            } catch (err) {
                console.error(err);
    
        };
    }};

    if(!open){
        return null
    }
    return ReactDom.createPortal(
        <>
            <div style={{
                position: 'fixed',
                top: '50%',
                right: '50%',
                transform: 'translate(50%, -50%)',
                padding: '50px',
                zIndex: 901,
                backgroundColor: 'rgba(255, 255, 255, .9)'
            }}>
               <article className="confirm">
                    <button onClick={onCloseConfirm} style={{backgroundColor: 'red'}}>NO</button>
                    <button onClick={onDonateClicked}style={{backgroundColor: 'green'}}>Yes</button>
                </article>    
            </div>
        </>,
        document.getElementById('portal')
    )
};