import React, { useEffect, useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { useGetAlllocaQuery , useDeletelocaMutation, useDonatelocaMutation } from './LocaApiSlice';
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import OverayCenter from '../../components/OverlayLocaMain.js';
import {QRCodeSVG} from 'qrcode.react';
import { translate } from '../../hooks/translator.js';


const LocasExcerpt = ({ i , own}) => {

    const navigate = useNavigate();

    const username = useSelector(selectCurrentUser)
    const [loca, setLoca] = useState(null);
    const [text, setText] = useState('');
    const [set , setSet] =useState(false)

    const user = useSelector(selectCurrentUser);


    


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

    if (!loca) {
        return <p>Location not found</p>;
    }

    console.log(loca)

    return (
        
        
            
            <div onClickCapture={() => { setPortal(true); }} className="food-waste-item" style={{width: '100%' }}>
                <OverayCenter open={portal} loca={loca} onClose={() => { setPortal(false);}} own={own}/>
                <div className='food-waste-front'>
                    <img src={require('../../components/img/home.png')} alt="meat icon" className='smalllogolist' />
                </div>
                <div className='overcontent'>
                    
                    <div className="food-waste-content">
                            <div className="food-waste-details">
                                <h2>{loca?.food?.text + ' : ' + i?.num + " " + (loca?.food?.typeCount || "")}</h2>
                                <ul>
                                    <li><p>{loca.province}</p></li>
                                    <p>{loca.user.username === username ? 'own' : 'get'}</p>
                                    {(loca?.getPId && own)?<li><p>{translate("username") +" : " +  loca.getPId.username || null}</p></li> : null }
                                    {(loca?.user && !own)? <li><p>{translate("username") +" : " +  loca.user.username + " aka : " + loca.user.aka || null}</p></li> : null}
                                    {(loca?._id )? <li><Link to={`/location/${loca._id}/${(loca.own !== undefined ? true : false)}`}>{translate("singlePage")}</Link></li> : null}
                                </ul>
                                <div className='food-waste-content'>
                                    <ul className='food-waste-details'>
                                    {(loca?.user?._id && !own)? <li><Link to={`/getuser/${loca.user._id}`}>{translate("thatPerson")}</Link></li> : null}
                                    {(loca?.getPId?._id && own)? <li><Link to={`/getuser/${loca.getPId._id}`}>{translate("thatPerson")}</Link></li> : null}
                                    {(loca?.post && loca?.getPId?._id)? <li><Link to={`/post/true/${loca.post}`}>{translate("toThatPost")}</Link></li> : null}
                                    </ul>
                                </div>
                                
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