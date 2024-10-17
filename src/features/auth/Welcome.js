import {useSelector} from 'react-redux'
import { selectCurrentUser , selectCurrentAka , selectCurrentImage} from './authSlice'
import { Link } from 'react-router-dom'

import React, { useState } from 'react'

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
                    <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/recommend" > for recommendation </Link></p>
                </div>

                <a href={'/recommend'} className='linkcontainersingleimg'>
                    <div className='content' style={{ borderRadius: '5dvi',   border: '1px solid black' }}>
                        <img src='./shopping.png' alt="shopping" className='mainimageSinglet' style={{ border : '0px'}}/>
                    </div>
                </a>
                    
            </div> 
            <div className='overcontent'>
                <div className='content' >
                    <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/user"  > Add yours food in list </Link></p>
                </div >
                <div className='content'>
                    <a href={'/user/exp'} className='mainimgcontainer'>
                        <img src='./bin.png' alt="shopping" className='mainimage' />
                    </a>
                    <a href={'/user'} className='mainimgcontainer'>
                        <img src='./note.png' alt="shopping" className='mainimage' />
                    </a>
                </div>
            </div>
            <div className='overcontent'>
                <div className='content'>
                    <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/buyrecommend" > Static </Link></p>
                </div>
                <a href={'/buyrecommend'} className='linkcontainersingleimg'>
                    <div className='content' style={{ borderRadius: '5dvi',   border: '1px solid black' }}>
                        <img src='./static.png' alt="shopping" className='mainimageSinglet' style={{ border : '0px'}}/>
                    </div>
                </a>
                
            </div>
            <div className='overcontent'>
                <div className='content'>
                    <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/buyrecommend" > Food storage Tips </Link></p>
                </div>
                <div className='content'>
                    <a href={'/?'} className='mainimgcontainer'>
                        <img src='./veg.png' alt="shopping" className='mainimage' />
                    </a>
                    <a href={'/?'} className='mainimgcontainer'>
                        <img src='./meat.png' alt="shopping" className='mainimage' />
                    </a>
                </div>
            </div>
            <div className='overcontent'>
                <div className='content'>
                    <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/recommend" > Food recommendation </Link></p>
                </div>
                <a href={'/recommend'} className='linkcontainersingleimg'>
                    <div className='content' style={{ borderRadius: '5dvi',   border: '1px solid black' }}>
                        <img src='./rama.png' alt="shopping" className='mainimageSinglet' style={{ border : '0px'}}/>
                    </div>
                </a>
            </div>
            <div className='overcontent'>
                <div className='content' >
                    <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/location"  > Food sharing </Link></p>                </div >
                <div className='content'>
                    <a href={'/location'} className='mainimgcontainer'>
                        <img src='./loca.png' alt="shopping" className='mainimage' />
                    </a>
                    <a href={'/location/ofuser'}className='mainimgcontainer'>
                        <img src='./lovinghand.png' alt="shopping" className='mainimage' />
                    </a>
                </div>
            </div>
        </section>
        </div>
    )

  return content 
}

export default Welcome