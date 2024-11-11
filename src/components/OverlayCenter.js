import React, { useState } from "react";
import ReactDom from 'react-dom';
import { Link } from "react-router-dom";
import Confirm from "./Confirm";

export default function OverayCenter({ loca, open, onClose ,own }) {
    const [confirm , setConfirm] = useState(false);

    if (!open) {
        return null;
    }


    if (!own) {
        return ReactDom.createPortal(
            <>
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    right: '50%',
                    transform: 'translate(50%, -50%)',
                    padding: '50px',
                    zIndex: 900
                }}> 
                    <Confirm loca={loca} open={confirm} onCloseConfirm={() => setConfirm(false)}/>
                    <article style={{ backgroundColor: 'rgba(255, 255, 255, .9)' }}>
                        <img onClick={onClose} src={require('../components/img/back.png')} alt="back" className="smalllogo" style={{ transform: 'translate(-50%)' }} />
                        <div className="food-waste-item" style={{border : '0px'}}>
                            <div>
                                <img src={require('../components/img/home.png')} alt="home" />
                            </div>
                            <div className="food-waste-details" style={{ width: '200px' }}>
                                <p>{loca.food.text + ' ' + loca.num}</p>
                                <p>หมดอายุวันที่</p>
                                <p>{loca.food.timeOut.split('T')[0].replace(/-/g, "/")}</p>
                                {loca.getPId?._id ? <Link to={`/getuser/${loca.getPId?._id}`}>that person</Link> : <p>no data</p>}
                            </div>
                        </div>
                        <div className="food-waste-item" style={{border : '0px',  textAlign: 'start', justifyContent: 'space-between' }}>
                            <div className="food-waste-details" style={{ textAlign: 'left' }}>
                                <p>{loca.province}</p>
                            </div>
                            <div className="food-waste-details">
                                <div onClickCapture={() => setConfirm(true)} style={{
                                    border: '1px solid black',
                                    backgroundColor: '#92F356',
                                    borderRadius: '5px',
                                    height: '50px',
                                    width: '40px'
                                }}>
                                    <img src={require('../components/img/checkT.png')} alt="YES" style={{
                                        margin: '15%',
                                        marginTop: '30%',
                                        height: '50%',
                                        width: '70%'
                                    }} />
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </>,
            document.getElementById('portal')
        );
    } else if (own){
        return ReactDom.createPortal(
            <>
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    right: '50%',
                    transform: 'translate(50%, -50%)',
                    padding: '50px',
                    zIndex: 900
                }}> 
                    <article style={{ backgroundColor: 'rgba(255, 255, 255, .9)' }}>
                        <img onClick={onClose} src={require('../components/img/back.png')} alt="back" className="smalllogo" style={{ transform: 'translate(-50%)' }} />
                        <div className="food-waste-item" style={{border : '0px'}}>
                            <div>
                                <img src={require('../components/img/home.png')} alt="home" />
                            </div>
                            <div className="food-waste-details" style={{ width: '200px' }}>
                                <p>{loca.food.text + ' ' + loca.num}</p>
                                <p>หมดอายุวันที่</p>
                                <p>{loca.food.timeOut.split('T')[0].replace(/-/g, "/")}</p>
                                {loca.getPId?._id ? <Link to={`/getuser/${loca.getPId?._id}`}>that person</Link> : <p>no data</p>}
                            </div>
                        </div>
                        <div className="food-waste-item" style={{border : '0px',  textAlign: 'start', justifyContent: 'space-between' }}>
                            <div className="food-waste-details" style={{ textAlign: 'left' }}>
                                <p>{loca.province}</p>
                            </div>
                            <div className="food-waste-details">
                            <div style={{
                                    border: '1px solid black',
                                    backgroundColor: loca.getPId?._id ? 'green' : 'red', 
                                    borderRadius: '5px',
                                    height: '50px',
                                    width: '40px'
                                }}/>
                            </div>
                        </div>
                    </article>
                </div>
            </>,
            document.getElementById('portal')
        );
    }
    
};