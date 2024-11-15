import React, { useState } from "react";
import ReactDom from 'react-dom';
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useCreateNoteMutation, useUpdateNoteMutation } from "../features/users/NoteApiSlice";
import { useCreatePostMutation } from "../features/post/PostApiSlice";

export default function UpdateAmount({ note , onCloseConfirm ,  open }) {
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();
    
    const [updateNote , {data: update , isSuccess : userEndSuccess}] = useUpdateNoteMutation();
    
    const [count , setCount] = useState(parseInt(note.count[note.count.length -1 ]));
    const [countExp , setCountExp] = useState(parseInt(note.countExp[note.countExp.length -1 ]));

    if (!open) {
        return null;
    }

   
        

        const onSent = async () => {


            try {
                
                await updateNote({id : note.id , count : (count || 0) , countExp : (countExp || 0) }).unwrap()
                

                navigate(`/user/note`)

              } catch (err) {
                console.error("Failed to save the post", err);
                if (err.originalStatus === 409) {
                  navigate(`/user/note/edit/${err.data.noteId}`);
                } else if (err.name === "TypeError" && err.message === "Failed to fetch") {
                  console.error("Network or CORS error: ", err);
                } else {
                  console.error("Unexpected error: ", err);
                }
              }
        };
 

    return ReactDom.createPortal(
        <>
            <div style={{
                position: 'fixed',
                top: '50%',
                right: '50%',
                width: '100%',
                transform: 'translate(50%, -50%)',
                padding: '50px',
                zIndex: 902,
            }}>
                <article style={{ backgroundColor: 'rgba(255, 255, 255, 1)', width: '90%' }}>
                    <img onClick={onCloseConfirm} src={require('../components/img/back.png')} alt="back" className="smalllogo" style={{ transform: 'translate(-50%)' }} />
                    
                    <div className="food-waste-item-sub" style={{ border: '0px' }}>
                        <div className="food-waste-details-confirm-selection">
                            
                        </div>
                        <div className="food-waste-details-confirm-selection" style={{marginLeft : '10px'}}>
                            <h2>Amount</h2>
                            <div className="content">
                                <button onClick={() => setCount(count + 1)}>Add count</button>
                                <input
                                    style={{ width: '30%' }}
                                    value={count}
                                    onChange={(e) => setCount(e.target.value)}  // Ensure you update the state
                                    placeholder="Amount..."
                                />
                                
                                <button onClick={() => (0 <= count - 1) ? setCount(count - 1)  : null}>Subtact count</button>
                            </div>
                            <h2>Amount Expired</h2>
                            <div className="content">
                                <button onClick={() => count >= countExp +1 ? setCountExp(countExp + 1) : null}>Add count</button>
                                <input
                                    style={{ width: '30%' }}
                                    value={countExp}
                                    onChange={(e) => setCountExp(e.target.value)}  // Ensure you update the state
                                    placeholder="Amount..."
                                />
                                
                                <button onClick={() => 0 <= countExp - 1 ? setCountExp(countExp - 1) : null}>Subtact count</button>
                            </div>
                        </div>
                    </div>

                    <div className="food-waste-item-sub" style={{ border: '0px'}}>

                        <div className="food-waste-details">
                            <div onClick={() => onSent()} style={{
                                border: '1px solid black',
                                backgroundColor: '#92F356',
                                borderRadius: '5px',
                                height: '50px',
                                width: '50px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <img src={require('../components/img/checkT.png')} alt="YES" style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain'
                                }} />
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </>,
        document.getElementById('portal')
    );
};
