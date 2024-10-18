import React from 'react'
import Header from '../../components/Header'
import { Link } from 'react-router-dom'

const Noti = () => {
  return (
    <div className='page'>
        <Header/>
        <div className='overcontent'>
            <div className='content' >
                <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/user/shopping/false/false/null" > Notifications </Link></p>
                
            </div>
            <h2> No one home...</h2>
            <h2> No api for this</h2>
            <h2> so it me</h2>
            <h2> here to complain</h2>
            <h2> i </h2>
            <h2> want</h2>
            <h2> to</h2>
            <h2> sleep</h2>
            <h2> it's</h2>
            <h2> 3 AM</h2>
            <h2> TT</h2>
        </div>
    </div>
  )
}

export default Noti