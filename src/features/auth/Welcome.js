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
            <p><Link to="/user" > Your random number </Link></p>
            <p><Link to="/usergetnum" > Go get your number </Link></p>
            <h2> After เฉลย </h2>
            <p><Link to="/userslist">Go to the Users List</Link></p>
            <p><Link to="/usergetwho"> Who is your buddy???? </Link></p>
            <h2> For Admin </h2>
            <p>  To lazy for check role in frontend</p>
            <p><Link to="/usercheck"> check for a duplicate </Link></p>
            <p><Link to="/admincmd"> admin give premison</Link></p>
            <h2> Log out idk why u need this lol</h2>
            <p><Link to="/logout"> log out</Link></p>
        </section>
    )

  return content 
}

export default Welcome