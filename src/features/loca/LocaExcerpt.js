import React, { useEffect, useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { useGetAlllocaQuery , useDeletelocaMutation, useDonatelocaMutation } from './LocaApiSlice';
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import OverayCenter from '../../components/OverlayCenter';
import {QRCodeSVG} from 'qrcode.react';


const LocasExcerpt = ({ i , own}) => {



    const navigate = useNavigate();

    const { data, isLoading } = useGetAlllocaQuery();
    const [loca, setLoca] = useState(null);
    const [text, setText] = useState('');
    const [set , setSet] =useState(false)
    const [donateC , setDonateC] = useState(false)

    const user = useSelector(selectCurrentUser);

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



    const imagePath = loca?.imageUser?.map(p => { return `${process.env.REACT_APP_API}/${p.replace(/\\/g, '/')}`}) || [];

    console.log(loca)
    return (
        
        
            
            <div onClickCapture={() => { setPortal(true); }} className="food-waste-item">
                <OverayCenter open={portal} loca={loca} onClose={() => { setPortal(false);}} own={own}/>
                <div className='food-waste-front'>
                    <img src={require('../../components/img/home.png')} alt="meat icon" className='smalllogolist' />
                </div>
                <div className='overcontent'>
                    <div className="food-waste-content">
                            <div className="food-waste-details">
                                <p>{loca?.food?.text + ' ' + i?.num}</p>
                                <ul>
                                    <li><p>{loca.province}</p></li>
                                    {(loca?.getPId && own)?<li><p>{"username : " +  loca.getP || null}</p></li> : null }
                                    {(loca?.user && !own)? <li><p>{"username : " +  loca.user.username + " aka : " + loca.user.aka || null}</p></li> : null}
                                    {(loca?._id )? <li><Link to={`/location/${loca._id}`}>single page</Link></li> : null}
                                    {(loca?.user?._id && !own)? <li><Link to={`/getuser/${loca.user._id}`}>that person</Link></li> : null}
                                    {(loca?.getPId?._id && own)? <li><Link to={`/getuser/${loca.getPId._id}`}>that person</Link></li> : null}
                                </ul>
                            </div>
                            
                    </div>
                </div> 
                <div>
                    <QRCodeSVG  value={`${process.env.REACT_APP_HOSTING}/location/${loca._id}`  } size={50} />
                </div>
            </div>
            
            
        
        
    );
};

export default LocasExcerpt;

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