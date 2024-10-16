import {useSelector} from 'react-redux'
import { selectCurrentUser , selectCurrentAka , selectCurrentImage} from './authSlice'
import { Link } from 'react-router-dom'

import React from 'react'

import Header from '../../components/Header'
import { BarChart } from '@mui/x-charts'

const Welcome = () => {
    const user = useSelector(selectCurrentUser)
    const aka = useSelector(selectCurrentAka);
    const image = useSelector(selectCurrentImage);
   


    const imagePath = `http://localhost:3500/${image?.toString().replace(/\\/g, '/')}`;

    const content = (
        <div style={{width : '100%' , height :'100%'}}>
        <Header/>
        <section className="welcome"> 
            <div className='overcontent'>
                <div className='content' >
                    <img src='./image copy 3.png' alt="noti" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}}><Link to="/recommend" style={{color : "pink" , fontWeight : 'bold' , fontSize : '40px'}}> for recommendation </Link></p>
                </div>

                <div className='content' style={{width : '100%'}} >
                    <a href='/recommend' className='mainimage' style={{ padding : '20%' }} >
                        <img src='./image copy 4.png' alt="shopping" className='mainimagesingle' />   
                    </a>
                </div>
                    
            </div> 
            <div className='overcontent'>
                <div className='content' >
                    <img src='./image copy 3.png' alt="noti" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}}><Link to="/user" style={{color : "pink" , fontWeight : 'bold' , fontSize : '40px'}} > Add yours food in list </Link></p>
                </div >
                <div className='overcontent'>
                    <a href='/user' className='content'><img src='./note.png' alt="shopping" className='mainimage' style={{ paddingLeft : '50px' ,  paddingRight : '50px' , width: '40%' , height: '50%'}}/>
                    </a>
                    <a herf='/user/exp' className='content'><img src='./bin.png' alt="shopping" className='mainimage' style={{ paddingLeft : '50px' ,  paddingRight : '50px' , width: '40%' , height: '50%'}}/>
                    </a>              
                </div>
            </div>
            <div className='overcontent'>
                <div className='content'>
                    <img src='./image copy 3.png' alt="noti" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}}><Link to="/buyrecommend" style={{color : "pink" , fontWeight : 'bold' , fontSize : '40px'}}> Static </Link></p>
                </div>
                <img src='./static.png' alt="shopping" className='mainimage'/>
            </div>
            <div className='overcontent'>
                <div className='content'>
                    <img src='./image copy 3.png' alt="noti" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}}><Link to="/buyrecommend" style={{color : "pink" , fontWeight : 'bold' , fontSize : '40px'}}> Food storage Tips </Link></p>
                </div>
                <div className='content'>
                    <img src='./veg.png' alt="shopping" className='mainimage' style={{ paddingLeft : '50px' ,  paddingRight : '50px' , width: '40%' , height: '70%'}}/>
                    <img src='./meat.png' alt="shopping" className='mainimage' style={{ paddingLeft : '50px' ,  paddingRight : '50px' , width: '40%' , height: '70%'}}/>
                </div>
            </div>
            <div className='overcontent'>
                <div className='content'>
                    <img src='./image copy 3.png' alt="noti" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}}><Link to="/recommend" style={{color : "pink" , fontWeight : 'bold' , fontSize : '40px'}}> Food recommendation </Link></p>
                </div>
                <img src='./rama.png' alt="shopping" className='mainimage'/>
            </div>
            <div className='overcontent'>
                <div className='content' >
                    <img src='./image copy 3.png' alt="noti" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}}><Link to="/location" style={{color : "pink" , fontWeight : 'bold' , fontSize : '40px'}} > Food sharing </Link></p>
                </div >
                <div className='content'>
                    <img src='./loca.png' alt="shopping" className='mainimage' style={{ paddingLeft : '50px' ,  paddingRight : '50px' , width: '40%' , height: '70%'}}/>
                    <img src='./lovingHand.png' alt="shopping" className='mainimage' style={{ paddingLeft : '50px' ,  paddingRight : '50px' , width: '40%' , height: '70%'}}/>
                </div>
            </div>
        </section>
        </div>
    )

  return content 
}

export default Welcome