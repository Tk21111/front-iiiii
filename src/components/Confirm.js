import React from "react";
import ReactDom from 'react-dom';
import { useNavigate } from "react-router-dom";
import { useDeletelocaMutation, useDonatelocaMutation } from "../features/loca/LocaApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useCreateNoteMutation } from "../features/users/NoteApiSlice";
import { useCreatePostMutation } from "../features/post/PostApiSlice";

export default function Confirm({ link, open, onCloseConfirm, loca }) {
    const navigate = useNavigate();
    const name = useSelector(selectCurrentUser);
    const [donate, { isLoading: isDonating, isError: donateErr }] = useDonatelocaMutation();
    const [createNote, { isLoading, isSuccess }] = useCreateNoteMutation();
    const [createPost , {data : post}] = useCreatePostMutation()

    const onDonateClicked = async (e) => {

        const onSent = async (loca , name) => {
            try {
                const formData = new FormData();
                formData.append(`notes[0][username]`, name);
                formData.append(`notes[0][text]`, loca.food.text);
                formData.append(`notes[0][date]`, loca.food.timeOut);
                formData.append(`notes[0][count]`, loca.num || 0);
                formData.append(`notes[0][countExp]`, 0);
                formData.append(`notes[0][tag]`, loca.food.tag);
                formData.append(`notes[0][donate]`, true);

               
                //create note for the recive user
                const cN = await createNote({ formData }).unwrap();
                console.log(cN)
            } catch (err) {
                console.log(err);
            }
        };

        if (loca._id) {
            try {

                //set loca to donated 
                await donate({ id: loca._id }).unwrap();
                await onSent(loca , name);

                const formDataPost = new FormData();
                formDataPost.append('title' , "chanel for " + name);
                formDataPost.append('content' , "food to get " + loca.food.text );
                formDataPost.append('getP' , name );
                formDataPost.append('loca' , loca._id );
                formDataPost.append('locaOwner' , loca.user.username );

                //set Conversation
                await createPost({formDataPost}).unwrap()
                
                onCloseConfirm();
                navigate(`/post/true`);
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (!open) {
        return null;
    }

    return ReactDom.createPortal(
        <>
            <div
                style={{
                    zIndex: 901,
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    border: '1px solid black' , borderRadius: '2vi',
                    height: '30vh'
                } }
                className="over-ray" >
                <div className="confirm">
                    <button onClick={onCloseConfirm} style={{ backgroundColor: 'red' }}>
                        NO
                    </button>
                    <button onClick={onDonateClicked} style={{ backgroundColor: 'green' }}>
                        Yes
                    </button>
                </div>
            </div>
        </>,
        document.getElementById('portal')
    );
}
