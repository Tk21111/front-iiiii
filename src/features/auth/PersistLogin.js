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
        const verifyRefreshToken = async () => {
            try {
                await refresh();
                setTrueSuccess(true);
            } catch (err) {
                console.error(err);
            }
        };

        // Skip the first effect run in development mode due to React 18 Strict Mode
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
            if (!token && persist) {
                verifyRefreshToken()
                /*
                if (token) {
                    console.log(token);
                    const decoded = jwtDecode(token);
                    dispatch(setCredentials({ "username": decoded.username }));
                }
                    */
            };
        }

        return () => {
            effectRan.current = true;
        };
    }, [token, persist, refresh, dispatch]); // Added dispatch to dependency array

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
