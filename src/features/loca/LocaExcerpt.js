import React, { useEffect, useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { useGetAlllocaQuery , useDeletelocaMutation } from './LocaApiSlice';
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';


const LocasExcerpt = ({ i }) => {



    const navigate = useNavigate();

    const { data, isLoading } = useGetAlllocaQuery();
    const [loca, setLoca] = useState(null);
    const [text, setText] = useState('');
    const [set , setSet] =useState(false)

    const [ deleteLoca , {isLoading : isDeleting}] = useDeletelocaMutation();

    useEffect (()=> {
        try {
            if(!text){
                setLoca(i);
                setText(i.text)
                setSet(true)
            }
        } catch (err) {
            console.log(err)
        }
        
    }, [i, loca])
    


    /*
    useEffect(() => {
        if (data && data.entities) {
            const loca = data.entities[locaId];
            setLoca(loca);
            if (loca) {
                setText(loca.text);
            } else {
                setText('Have been deleted');
            }
        }
    }, [data, locaId]);
    */

    if (isDeleting) {
        return <p> deleting</p>
    }
    if (!loca) {
        return <p>Location not found</p>;
    }


    return (
        <article>
            <h2>{text}</h2>
            <p>{loca.town}</p>
            <p className="postCredit">
                <Link to={`/location/${loca.id}`}>View Post</Link>
            </p>
        </article>
    );
};

export default LocasExcerpt;
