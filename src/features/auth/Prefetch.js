
import { store } from '../../app/store'
import { userApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {

    useEffect(() => {
        //store.dispatch(userApiSlice.util.prefetch('getUsers', 'usersList', { force: false }))
        //store.dispatch(userApiSlice.util.prefetch('getOu','user' , {force : false}))
    }, [])

    return <Outlet />
}
export default Prefetch
