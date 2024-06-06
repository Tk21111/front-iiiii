import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from 'react-redux';
import { selectCurrentToken } from "./authSlice";
import PulseLoader from 'react-spinners/PulseLoader';

const PersistLogin = () => {
    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);
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
        // Skip the first effect run in development mode due to React 18 Strict Mode
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
            const verifyRefreshToken = async () => {
                try {
                    await refresh();
                    setTrueSuccess(true);

                } catch (err) {
                    console.error(err);
                }
            };
            if (!token && persist) verifyRefreshToken();
        }

        return () => effectRan.current = true;
    }, [token, persist, refresh]);

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
