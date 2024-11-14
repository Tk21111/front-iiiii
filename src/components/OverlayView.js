import React, { useState } from "react";
import ReactDom from 'react-dom';
import { Link, useNavigate } from "react-router-dom";

import ConfirmSelection from "./ConfirmSelection";

export default function OverayCenterView({ imgPath , dataFood, open, onClose ,donate , select ,name , post}) {
    const [confirm , setConfirm] = useState(false);

    const navigate = useNavigate()

    console.log(dataFood)

    if (!open) {
        return null;
    }

    console.log(dataFood)
        return ReactDom.createPortal(
            <>
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    right: '50%',
                    width: '100%',
                   
                    transform: 'translate(50%, -50%)',
                    padding: '50px',
                    zIndex: 800
                }}> 
                    <ConfirmSelection name={name} donate={donate} imgPath={imgPath} dataFood={dataFood} open={confirm} onCloseConfirm={() => setConfirm(false)} />
                    <article style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
                        <img onClick={onClose} src={require('../components/img/back.png')} alt="back" className="smalllogo" style={{ transform: 'translate(-50%)' }} />
                        <div className="food-waste-item" style={{border : '0px'}}>
                            <div>
                                <img src={imgPath || require('../components/img/meal.png')} className="smalllogo-vertical-fix"alt="home" />
                            </div>
                            {post?.split("=")[0] === 'food' ? (<div className="food-waste-details" style={{ width: '200px' }}>
                                <p>{(dataFood.text.length > 10 ? dataFood.text.substr(0,10) + '..' : dataFood.text) + '\n' + ': ' + dataFood.count[dataFood.count.length - 1]}</p>
                                <p>Created at</p>
                                <p>{dataFood.createdAt.split('T')[0].replace(/-/g, "/")}</p>
                                <p>Expire at</p>
                                <p>{dataFood.timeOut.split('T')[0].replace(/-/g, "/")}</p>
                            </div>) : (
                                <div className="food-waste-details" style={{ width: '200px' }}>
                                <p>{(dataFood?.food?.length > 10 ? dataFood.food.substr(0,10) + '..' : dataFood?.food)}</p>
                                <h2>Desciption</h2>
                                <p>{dataFood.des}</p>
                                <h2>tag</h2>
                                <p>{dataFood.tag.toString()}</p>
                                <h2>ingredent //fix later check format in recommentCreate</h2>
                                {dataFood.ingredent.map(val => 
                                <>
                                    <p>{val["0"]}</p>
                                    <p>{val["1"]}</p>
                                </>
                            )}
                            </div>
                            )}
                        </div>
                        <div className="food-waste-item" style={{border : '0px',  textAlign: 'start', justifyContent: 'space-between' }}>
                            <div className="food-waste-details" style={{ textAlign: 'left' }}>
                               
                            </div>
                            <div className="food-waste-details">
                            <div 
                                onClickCapture={() => {
                                    if (post?.split("=")[1] === 'true') {
                                        navigate(`/post/create/${(post.split("=")[0] === 'food' ? "food=" +  dataFood?.id : "how=" + dataFood?._id)}`);
                                    } else if ( select === 'false'){
                                        onClose();                                       
                                    } else {
                                        setConfirm(true);
                                    }
                                }}
                                style={{
                                    border: '1px solid black',
                                    backgroundColor: '#92F356',
                                    borderRadius: '5px',
                                    height: '50px',
                                    width: '40px'
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

                            </div>
                        </div>
                    </article>
                </div>
            </>,
            document.getElementById('portal')
        );
    
    
};
