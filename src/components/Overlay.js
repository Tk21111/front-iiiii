import React from "react";
import ReactDom from 'react-dom'
import { Link, useNavigate } from "react-router-dom";



export default function Overay({link}) {
    return ReactDom.createPortal(
        <>
            <div style={{position: 'fixed',
                            top: '90%',
                            right: '10%',
                            transform: 'translate(50%, -50%)',
                            
                            
                            padding: '50px',
                            zIndex: 1000}}>
                <a href={link}>
                    <img src="./+.png" alt="+"></img>
                </a>     
            </div>
        </>,
        document.getElementById('portal')
    )
};