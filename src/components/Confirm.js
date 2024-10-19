import React from "react";
import ReactDom from 'react-dom';
import { useNavigate } from "react-router-dom";
import { useDeletelocaMutation, useDonatelocaMutation } from "../features/loca/LocaApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useCreateNoteMutation } from "../features/users/NoteApiSlice";

export default function Confirm({ link, open, onCloseConfirm, data, dataFood }) {
    const navigate = useNavigate();
    const name = useSelector(selectCurrentUser);
    const [donate, { isLoading: isDonating, isError: donateErr }] = useDonatelocaMutation();
    const [createNote, { isLoading, isSuccess }] = useCreateNoteMutation();

    const onDonateClicked = async (e) => {
        const onSent = async (data, dataFood, name) => {
            try {
                const formData = new FormData();
                formData.append(`notes[0][username]`, name);
                formData.append(`notes[0][text]`, dataFood.text);
                formData.append(`notes[0][date]`, dataFood.exp);
                formData.append(`notes[0][count]`, dataFood.num || 0);
                formData.append(`notes[0][countExp]`, 0);
                formData.append(`notes[0][tag]`, dataFood.tag);
                formData.append(`notes[0][donate]`, true);

                const cN = await createNote({ formData }).unwrap();
                console.log(cN)
            } catch (err) {
                console.log(err);
            }
        };

        if (data?.id) {
            try {
                const response = await donate({ id: data?.id }).unwrap();
                await onSent(data, dataFood, name);
                onCloseConfirm();
                //navigate(`/getuser/${data.user}`);
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
                    position: 'fixed',
                    top: '50%',
                    right: '50%',
                    transform: 'translate(50%, -50%)',
                    padding: '50px',
                    zIndex: 901,
                    backgroundColor: 'rgba(255, 255, 255, .9)',
                }}
            >
                <article className="confirm">
                    <button onClick={onCloseConfirm} style={{ backgroundColor: 'red' }}>
                        NO
                    </button>
                    <button onClick={onDonateClicked} style={{ backgroundColor: 'green' }}>
                        Yes
                    </button>
                </article>
            </div>
        </>,
        document.getElementById('portal')
    );
}
