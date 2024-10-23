import React, { useEffect, useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { useGetAlllocaQuery , useDeletelocaMutation, useDonatelocaMutation } from './LocaApiSlice';
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import OverayCenter from '../../components/OverlayControl';


const LocasExcerptOrg = ({ i , own}) => {



    const navigate = useNavigate();

    const { data, isLoading } = useGetAlllocaQuery();
    const [loca, setLoca] = useState(null);
    const [text, setText] = useState('');
    const [set , setSet] =useState(false)
    const [donateC , setDonateC] = useState(false)

    const [ deleteLoca , {isLoading : isDeleting}] = useDeletelocaMutation();

    


    const [ portal , setPortal] = useState(false);

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



    const imagePath = i?.imageUser?.map(p => { return `${process.env.WEB_ENV}/${p.replace(/\\/g, '/')}`}) || [];

    return (
        
            <a href={`/location/oforg/${i._id}`} className="food-waste-item" style={{color : 'black' , textDecoration: 'none'}}>
                <div className='food-waste-front'>
                    <img src={require('../../components/img/org.png')} alt="meat icon" className='smalllogolist' />
                </div>
                    <div className="food-waste-content">
                            <div className="food-waste-details">
                                <ul>
                                    <li><p>{"username : " +  i?.aka || null}</p></li>
                                    <li><p>{"more : " + i?.more || null }</p></li>
                                </ul>
                            </div>
                            
                    </div> 
            </a>
            
            
        
        
    );
};

export default LocasExcerptOrg;

/*<div>
                <h2>{text}</h2>
                <p>{loca.town}</p>
                <p>{"Have : " + loca.num}</p>
                <p>{"Exp date : " + loca.exp}</p>
                <p>{loca.aka}</p>
                <p>{"Getter name : " + loca.getP || 'not allowed to see'}</p>
                {loca.getPId? <Link to={`/getuser/${loca.getPId}`}>that person</Link> : <p>no data</p>}
            </div>
            <div>
                {imagePath.map((path, i) => (
                    <img
                        key={i}
                        src={path}
                        alt={`note image ${i}`}
                        style={{ flexGrow: 1, maxWidth: '20%', maxHeight: '20%' }}
                    />
                ))}
                <p style={{color: 'red'}}>{loca.organisation ? "organisation" : "user"}</p>
            </div>
            <p className="postCredit">
                <Link to={`/location/${loca.id}`}>View Post</Link>
            </p>
            */