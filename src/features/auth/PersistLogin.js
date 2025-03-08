import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentToken, setCredentials } from "./authSlice";
import PulseLoader from 'react-spinners/PulseLoader';
import { jwtDecode } from 'jwt-decode';

const PersistLogin = () => {
    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);
    const dispatch = useDispatch(); // Moved useDispatch here
    const effectRan = useRef(false);

    const [trueSuccess, setTrueSuccess] = useState(false);

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation();

     useEffect(() => {
        
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode
            
            const verifyRefreshToken = async () => {
                
                try {

                    const refreshToken = localStorage.getItem('login')
                    const response = await refresh({refreshToken}).unwrap();
                    
                    const  accessToken  = response.accessToken

                    const decoded = jwtDecode(accessToken);
                    
                    //have to dispatch anyway
                    dispatch(setCredentials({user : decoded.userinfo.username, accessToken , image : response.image , aka : response.aka , roles : response.roles}))
                    
                    setTrueSuccess(true)
                    
                }
                catch (err) {
                    console.error(err)
                }
            }

            if (!token && persist) verifyRefreshToken()
        }

        return () => effectRan.current = true

        // eslint-disable-next-line
    }, [token, persist, refresh])
    let content;

    if (!persist) {
        // When persist is false
        content = <Outlet />;
    } else if (isLoading) {
        // When the refresh token is being verified
        content = <PulseLoader color={"#FFF"} />;
    } else if (isError) {
        // When there's an error verifying the refresh token
        content = (
            <p className='errmsg'>
                {`${error?.data?.message} - `}
                <Link to="/login">Please login again</Link>.
            </p>
        );
    } else if (isSuccess && trueSuccess) {
        // When the token is successfully verified
        content = <Outlet />;
    } else if (token && isUninitialized) {
        // When there is a token but the mutation is not initialized
        content = <Outlet />;
    }

    return content;
};

export default PersistLogin;
