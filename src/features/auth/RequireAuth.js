import { useLocation , Navigate , Outlet } from "react-router-dom";
import { useSelector} from 'react-redux';
import { selectCurrentToken } from "./authSlice";

import React from 'react'

const RequireAuth = () => {
    const token = useSelector(selectCurrentToken)
    const localtion = useLocation()
  return (
    token ? <Outlet/> : <Navigate to='/login' state = {{from:localtion}} replace /> //because /login is not a page so we will not save that in history
  )
}

export default RequireAuth