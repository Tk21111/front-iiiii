import {useSelector} from 'react-redux'
import { selectCurrentUser , selectCurrentAka , selectCurrentImage} from './authSlice'
import { Link } from 'react-router-dom'

import React from 'react'

const Welcome = () => {
    const user = useSelector(selectCurrentUser)
    const aka = useSelector(selectCurrentAka);
    const image = useSelector(selectCurrentImage);
   

    const welcome = user? `Welcome ${user} aka ${aka}` : 'Welcome!'

    const imagePath = `http://localhost:3500/${image?.toString().replace(/\\/g, '/')}`;

    const content = (
        <section className="welcome">
            <h1>{welcome}</h1>
            <img src={imagePath} alt="note image" style={{flexGrow: 1 , maxWidth: 300 , maxHeight: 300, margin : "5%"  }} />
            <p><Link to="/user" > Add yours food in list </Link></p>
            <p><Link to="/recommend"> for recommendation </Link></p>
            <p><Link to="/location"> for location</Link></p>
            <p><Link to="/location/ofuser"> for users location</Link></p>
            <p><Link to="/buyrecommend">  By recommend</Link></p>
            <p><Link to="/logout"> log out</Link></p>
        </section>
    )

  return content 
}

export default Welcome