import {useSelector} from 'react-redux'
import { selectCurrentUser , selectCurrentAka , selectCurrentImage} from './authSlice'
import { Link } from 'react-router-dom'

import React, { useState } from 'react'

import Header from '../../components/Header'

import { translate } from '../../hooks/translator'





const Welcome = () => {
    const user = useSelector(selectCurrentUser)
    const aka = useSelector(selectCurrentAka);
    const image = useSelector(selectCurrentImage);

   

    

   
    

    const imagePath = `${process.env.REACT_APP_API}/${image?.toString().replace(/\\/g, '/')}`;


    const content = (
        <div style={{width : '100%' , height :'100%'}}>
        <Header/>
        <section className="welcome-main"> 
            <div className='overcontent'>
                {/*page cover*/}
                <div className='content' >
                    <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}} className='welcomefont-link'><Link to="/user/shopping/false/false/null/food" style={{textDecoration : 'none'}}> {translate("for_recommendation") }</Link></p>
                </div>
                {/*--- end ---*/}
                <a href={'/user/shopping/false/false/null/food'} className='linkcontainersingleimg'>
                    <div className='content' style={{ borderRadius: '5dvi',   border: '1px solid black' }}>
                        <img src='./shopping.png' alt="shopping" className='mainimageSinglet' style={{ border : '0px'}}/>
                    </div>
                </a>
                    
            </div> 
            <div className='overcontent'>
                <div className='content' >
                    <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}} className='welcomefont-link'><Link to="/user" style={{textDecoration : 'none'}}  > {translate("Add_yours_food_in_list") }</Link></p>
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
                    <p style={{ marginRight : 'auto'}} className='welcomefont-link'><Link to="/static"  style={{textDecoration : 'none'}} > {translate("Static") }</Link></p>
                </div>
                <a href={'/static'} className='linkcontainersingleimg'>
                    <div className='content' style={{ borderRadius: '5dvi',   border: '1px solid black' }}>
                        <img src='./static.png' alt="shopping" className='mainimageSinglet' style={{ border : '0px'}}/>
                    </div>
                </a>
                
            </div>
            <div className='overcontent'>
                <div className='content'>
                    <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}} className='welcomefont-link'><Link to="/buyrecommend" style={{textDecoration : 'none'}} > {translate("Food_storage_Tips") }</Link></p>
                </div>
                <div className='content'>
                    <a href={'/store/veg'} className='mainimgcontainer'>
                        <img src='./veg.png' alt="shopping" className='mainimage' />
                    </a>
                    <a href={'/store/meat'} className='mainimgcontainer'>
                        <img src='./meat.png' alt="shopping" className='mainimage' />
                    </a>
                </div>
            </div>
            <div className='overcontent'>
                <div className='content'>
                    <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}} className='welcomefont-link'><Link to="/recommend" style={{textDecoration : 'none'}} >{translate("Menu_recommendation")}</Link></p>
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
                    <p style={{ marginRight : 'auto'}} className='welcomefont-link'><Link to="/location"  style={{textDecoration : 'none'}} > {translate("Food_Sharing")} </Link></p>
                </div >
                <div className='content'>
                    <a href={'/location'} className='mainimgcontainer'>
                        <img src={require('../../components/img/loca.png')} alt="shopping" className='mainimage' />
                    </a>
                    <a href={'/location/ofuser'}className='mainimgcontainer'>
                        <img src={require('../../components/img/lovingHand.png')} alt="shopping" className='mainimage' />
                    </a>
                    <a href={'/location/oforg'}className='mainimgcontainer'>
                        <img src={require('../../components/img/lovingHand.png')} alt="shopping" className='mainimage' />
                    </a>
                    <a href={'/post/false'}className='mainimgcontainer'>
                        <img src={require('../../components/img/lovingHand.png')} alt="shopping" className='mainimage' />
                    </a>
                </div>
            </div>
        </section>
        </div>
    )

  return content 
}

export default Welcome