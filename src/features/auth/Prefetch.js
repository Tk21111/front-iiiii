
import { store } from '../../app/store'
import { noteApislice } from '../users/NoteApiSlice';
import { locaApislice } from '../loca/LocaApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {

    useEffect(() => {
        /*
        store.dispatch(noteApislice.util.prefetch('getNote', 'noteUser', { force: true }))
        store.dispatch(locaApislice.util.prefetch('getLocaUser','locaUser' , {force : true}))
        store.dispatch(locaApislice.util.prefetch('getLoca','loca' , {force : true}))
        */
        
    }, [])

    return <Outlet />
}
export default Prefetch
