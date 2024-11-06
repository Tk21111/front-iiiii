import React, { useEffect, useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import OverayCenter from '../../components/OverlayControl';


const PostsExcerpt = ({ i}) => {



    const navigate = useNavigate();

    const [loca, setLoca] = useState(null);
    const [text, setText] = useState('');
    const [set , setSet] =useState(false)
    const [donateC , setDonateC] = useState(false)

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



    const imagePath = i?.images.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);

    console.log(loca)
    return (
        
        
            
            <div onClickCapture={() => { setPortal(true); }} className="food-waste-item">
                <div className='food-waste-front'>
                    <img src={require('../../components/img/home.png')} alt="meat icon" className='smalllogolist' />
                </div>
                <div className='overcontent'>
                    <div className="food-waste-content">
                            <div className="food-waste-details">
                                <p>{i.text + ' ' + i.num}</p>
                                <ul>
                                    <li><p>{loca.province}</p></li>
                                    <li><p>{"username : " +  loca.userName || null}</p></li>
                                    {(loca?._id )? <li><Link to={`/location/${loca._id}`}>single page</Link></li> : null}
                                </ul>
                            </div>
                            
                    </div>
                </div> 
            </div>
            
            
        
        
    );
};

export default PostsExcerpt;

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