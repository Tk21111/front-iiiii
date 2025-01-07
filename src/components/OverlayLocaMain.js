import React, { useState } from "react";
import ReactDom from 'react-dom';
import { Link } from "react-router-dom";
import Confirm from "./Confirm";

export default function OverlayCenter({ loca, open, onClose, own }) {
    const [confirm, setConfirm] = useState(false);

    if (!open) return null;

    // Check for loca and loca.food existence before using their properties
    const expirationDate = loca?.food?.timeOut ? new Date(loca.food.timeOut.split('T')[0]) : null;
    const currentDate = new Date();
    const daysLeft = expirationDate
        ? Math.floor((expirationDate - currentDate) / (1000 * 60 * 60 * 24))
        : "N/A";

    const overlayContent = (
        <div style={{
            zIndex: 900,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            border: '1px solid black' , borderRadius: '2vi'
        }} className="over-ray">
            <Confirm loca={loca} open={confirm} onCloseConfirm={() => setConfirm(false)} />
            <div>
                <img
                    onClick={onClose}
                    src={require('../components/img/back.png')}
                    alt="back"
                    className="smalllogo"
                    style={{ transform: 'translate(-50%)', cursor: 'pointer' }}
                />
                <div className="food-waste-item" style={{ border: '0px' }}>
                    <div>
                        <img src={require('../components/img/home.png')} alt="home" />
                    </div>
                    <div className="food-waste-details" style={{ width: '200px' }}>
                        <p>{`${loca?.food?.text || 'No food info'} : ${loca?.num || ''}  ${loca?.food?.type || ""}`}</p>
                        <p>Time left: {daysLeft} days</p>
                        {loca?.user?._id 
                            ? <Link to={`/getuser/${loca.user._id}`}>View profile</Link>
                            : <p>No user data</p>
                        }
                    </div>
                </div>
                <div className="food-waste-item" style={{ border: '0px', textAlign: 'start', justifyContent: 'space-between' }}>
                    <div className="food-waste-details" style={{ textAlign: 'left' }}>
                        <p>{loca?.province || 'No province data'}</p>
                    </div>
                    <div className="food-waste-details">
                        {own ? (
                            <div style={{
                                border: '1px solid black',
                                backgroundColor: loca?.getPId?._id ? 'green' : 'red',
                                borderRadius: '5px',
                                height: '50px',
                                width: '40px'
                            }} />
                        ) : (
                            <div
                                onClick={() => setConfirm(true)}
                                style={{
                                    border: '1px solid black',
                                    backgroundColor: '#92F356',
                                    borderRadius: '5px',
                                    height: '50px',
                                    width: '40px',
                                    cursor: 'pointer'
                                }}
                            >
                                <img
                                    src={require('../components/img/checkT.png')}
                                    alt="YES"
                                    style={{
                                        margin: '15%',
                                        marginTop: '30%',
                                        height: '50%',
                                        width: '70%'
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return ReactDom.createPortal(
        overlayContent,
        document.getElementById('portal')
    );
}
