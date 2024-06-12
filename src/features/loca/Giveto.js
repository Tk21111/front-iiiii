import { useEffect, useState } from 'react';
import { useGetAlllocaQuery } from './LocaApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice'

import { Link } from 'react-router-dom';

const GetAllLoca = () => {
    const { data: users, isLoading, isSuccess, isError, error } = useGetAlllocaQuery();
    let content;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess) {
        //this is what u have to modifine
        console.log(users);
        const jsonString = JSON.stringify(users)
        content = (
            <section className="users">
                <h1>Location page</h1>
                <h2> {jsonString} </h2>
                <Link to="/welcome">Back to Welcome</Link>
                <Link to="/location/create"> create sharing location</Link>
            </section>
        );
    } else if (isError) {
        let msg;
        if (error.status === 403) {
            msg = "Access denied. Go get a random number first.";
        } else {
            msg = JSON.stringify(error);
        }
        content = (
            <section>
                <h1>{msg}</h1>
                <Link to="/welcome">Back to Welcome</Link>
                <Link to="/location/create"> create sharing location</Link>
            </section>
        );
    }

    return content;
};


export default GetAllLoca;
