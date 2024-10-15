import {useSelector} from 'react-redux'
import { selectCurrentUser , selectCurrentAka , selectCurrentImage} from './authSlice'
import { Link } from 'react-router-dom'

import React from 'react'

import Header from '../../components/Header'

const Welcome = () => {
    const user = useSelector(selectCurrentUser)
    const aka = useSelector(selectCurrentAka);
    const image = useSelector(selectCurrentImage);
   


    const imagePath = `http://localhost:3500/${image?.toString().replace(/\\/g, '/')}`;

    const content = (
        <section className="welcome">
            <Header/>
            <div className='overcontent'>
                <div className='content' style={{}}>
                    <img src='./image copy 3.png' alt="noti" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}}><Link to="/recommend" style={{color : "pink" , fontWeight : 'bold' , fontSize : '40px'}}> for recommendation </Link></p>
                </div>
                <img src='./image copy 4.png' alt="shopping" className='mainimage'/>
            </div>
            <div className='overcontent'>
                <div className='content' >
                    <img src='./image copy 3.png' alt="noti" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}}><Link to="/user" style={{color : "pink" , fontWeight : 'bold' , fontSize : '40px'}} > Add yours food in list </Link></p>
                </div >
                <div className='content'>
                    <img src='./image copy 4.png' alt="shopping" className='mainimage' style={{ paddingLeft : '50px' ,  paddingRight : '50px'}}/>
                    <img src='./image copy 4.png' alt="shopping" className='mainimage' style={{ paddingLeft : '50px' ,  paddingRight : '50px'}}/>
                </div>
            </div>
            <div className='overcontent'>
                <div className='content'>
                    <img src='./image copy 3.png' alt="noti" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}}><Link to="/buyrecommend" style={{color : "pink" , fontWeight : 'bold' , fontSize : '40px'}}> Static </Link></p>
                </div>
                <img src='./image copy 4.png' alt="shopping" className='mainimage'/>
            </div>
            <div className='overcontent'>
                <div className='content'>
                    <img src='./image copy 3.png' alt="noti" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}}><Link to="/buyrecommend" style={{color : "pink" , fontWeight : 'bold' , fontSize : '40px'}}> Food storage Tips </Link></p>
                </div>
                <img src='./image copy 4.png' alt="shopping" className='mainimage'/>
            </div>
            <div className='overcontent'>
                <div className='content'>
                    <img src='./image copy 3.png' alt="noti" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}}><Link to="/buyrecommend" style={{color : "pink" , fontWeight : 'bold' , fontSize : '40px'}}> Food recommendation </Link></p>
                </div>
                <img src='./image copy 4.png' alt="shopping" className='mainimage'/>
            </div>
            <div className='overcontent'>
                <div className='content' >
                    <img src='./image copy 3.png' alt="noti" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}}><Link to="/user" style={{color : "pink" , fontWeight : 'bold' , fontSize : '40px'}} > Food sharing </Link></p>
                </div >
                <div className='content'>
                    <img src='./image copy 4.png' alt="shopping" className='mainimage' style={{ paddingLeft : '50px' ,  paddingRight : '50px'}}/>
                    <img src='./image copy 4.png' alt="shopping" className='mainimage' style={{ paddingLeft : '50px' ,  paddingRight : '50px'}}/>
                </div>
            </div>
        </section>
    )

  return content 
}

export default Welcome