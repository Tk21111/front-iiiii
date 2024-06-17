import {useSelector} from 'react-redux'
import { selectCurrentUser } from './authSlice'
import { Link } from 'react-router-dom'

import React from 'react'

const Welcome = () => {
    const user = useSelector(selectCurrentUser)

    const welcome = user? `Welcome ${user}` : 'Welcome!'

    const content = (
        <section className="welcome">
            <h1>{welcome}</h1>
            <p> If you want username just login again </p>
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