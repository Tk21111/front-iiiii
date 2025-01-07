import React from 'react'
import Header from '../../components/Header'

const Contract = () => {
  return (
    <div className='page'>
        <Header/>
        <div>
            <p>ขวัญข้าว - เอกสาร</p>
            <p>Ig : silxnce_0</p>
        </div>
        <div>
            <p>Third - UI / UX design</p>
            <p>Ig : thxrcl</p>
        </div>
        <div>
            <p>TK - dev</p>
            <p>Ig : etf223y7</p>
        </div>
        <div>
            {"#web ล่มโทษ sever"}
        </div>
        <div>
            "@ IS work 2024 SW3 gifted 14"
        </div>

        <p>How to </p>
        <img src={require('../../components/img/ht0.png')} className='pic-how'></img>
        <img src={require('../../components/img/ht1.png')} className='pic-how'></img>
        <img src={require('../../components/img/ht2.png')} className='pic-how'></img>
        <img src={require('../../components/img/ht3.png')} className='pic-how'></img>
        <img src={require('../../components/img/ht4.png')} className='pic-how'></img>
    </div>
  )
}

export default Contract