import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useSignupMutation } from './authApiSlice';
import { translate } from '../../hooks/translator';

const Signup = () => {
    const userRef = useRef();
    const errRef = useRef();
    const [user, setUser] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [sex, setSex] = useState(false);
    const [pwd, setPwd] = useState('');
    const [cpwd, setCPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [signup, { isLoading }] = useSignupMutation();

    useEffect(() => {
        userRef.current.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (/\s/.test(user)) {
            setErrMsg('Username must not contain spaces');
            return;
        }

        if (pwd !== cpwd) {
            setErrMsg('Passwords do not match');
            return;
        }

        if (age < 8 || age > 120) {
            setErrMsg('Age must be between 8 and 120');
            return;
        }


        try {
            const userData = await signup({ user, pwd , name , age , sex}).unwrap();
            dispatch(setCredentials({ ...userData, user }));
            setUser('');
            setPwd('');
            setCPwd('');
            navigate('/login');
        } catch (err) {
            const status = err.originalStatus;
            if (!status) setErrMsg('No Server Response');
            else if (status === 400) setErrMsg('Missing Username or Password');
            else if (status === 401) setErrMsg('Unauthorized');
            else if (status === 409) setErrMsg('Username already taken');
            else setErrMsg('Login Failed');
            errRef.current?.focus();
        }
    };

    return isLoading ? (
        <h1>Loading...</h1>
    ) : (
        <div className="page">
            <section className="login">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
                    {errMsg}
                </p>
                <h1 className='welcomefont' style={{color : '#FFE55F'}}>signup</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username"  className='welcomefont' style={{color : '#F9AEFF'}}>{translate('username')}</label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="realname"  className='welcomefont' style={{color : '#BCEBFF' , fontSize : '2vi' }}></label>
                    <label htmlFor="realname"  className='welcomefont' style={{color : '#F9AEFF'}}>{translate('realname')}</label>
                    <input
                        type="text"
                        id="realname"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="off"
                        required
                    />
                    <label htmlFor="age"  className='welcomefont' style={{color : '#F9AEFF'}}>{translate("age")}</label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />
                    <label htmlFor="sex"  className='welcomefont' style={{color : '#F9AEFF'}}>{translate("sex")}</label>
                    <select
                        style={{height : '6vh' , fontSize : '80%'}}
                        id="sex"
                        value={sex}
                        onChange={(e) => setSex(e.target.value === "true")}
                    >
                        <option value="true">Male</option>
                        <option value="false">Female</option>
                    </select>
                    <label htmlFor="password"  className='welcomefont' style={{color : '#F9AEFF'}}>{translate("password")}</label>
                    <input
                        type="password"
                        id="password"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        required
                    />
                    <label htmlFor="cpassword"  className='welcomefont' style={{color : '#F9AEFF'}}>{translate("cpassword")}</label>
                    <input
                        type="password"
                        id="cpassword"
                        value={cpwd}
                        onChange={(e) => setCPwd(e.target.value)}
                        required
                    />
                    <button className='buttonCF' style={{color : '#B0E7FF' , backgroundColor : '#F9AEFF'}}>{translate("signup")}</button>
                </form>
            </section>
        </div>
    );
};

export default Signup;
