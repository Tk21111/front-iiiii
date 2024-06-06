import { useRef, useState, useEffect } from 'react'
import { useNavigate , Link } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useSigninMutation } from './authApiSlice'

const Signin = () => {
    const userRef = useRef() //set focus on userinput
    const errRef = useRef()
    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [cpwd, setCPwd] = useState('')
    const [no, setNo] = useState('')
    const [errMsg, setErrMsg] = useState('')
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [signin, { isLoading }] = useSigninMutation()
    

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd ,cpwd, no])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (pwd === cpwd && (no <=36 && no >=0) ) {
            try {
                const userData = await signin({ user, pwd , no }).unwrap()
                //diffrent the ...userData is a accessToken
                dispatch(setCredentials({ ...userData, user }))
                setUser('')
                setPwd('')
                navigate('/login')
            } catch (err) {
                if (!err?.originalStatus) {
                    // isLoading: true until timeout occurs
                    setErrMsg('No Server Response');
                } else if (err.originalStatus === 400) {
                    setErrMsg('Missing Username or Password');
                } else if (err.originalStatus === 401) {
                    setErrMsg('Unauthorized');
                } else if (err.originalStatus === 409) {
                    setErrMsg('Username or Number is already taken');
                } else {
                    setErrMsg('Login Failed');
                }

                if (errRef.current) return errRef.current.focus();
                
            }
        } else {setErrMsg('Password not match or Number is exceed an option');}
    }

    const handleUserInput = (e) => setUser(e.target.value)
    const handlePwdInput = (e) => setPwd(e.target.value)
    const handleNoInput = (e) => setNo(e.target.value)
    const handleCPwdInput = (e) => setCPwd(e.target.value)
    

    const content = isLoading ? <h1>Loading...</h1> : (
        <section className="login">
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> 

            <h1>Signin</h1>

            <form onSubmit={handleSubmit}> 
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef}
                    value={user}
                    onChange={handleUserInput}
                    autoComplete="off"
                    required
                />

                <label htmlFor="no">เลขที่มึงอ่ะ</label>
                <input
                    type="number"
                    id="no."
                    value={no}
                    onChange={handleNoInput}
                    autoComplete="off"
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password" //doesn't show it 
                    id="password"
                    onChange={handlePwdInput}
                    value={pwd}
                    required
                />
                <label htmlFor="cpassword">Confirm Password:</label>
                <input
                    type="password" //doesn't show it 
                    id="cpassword"
                    onChange={handleCPwdInput}
                    value={cpwd}
                    required
                />
                <button>Sign In</button>
            </form>
        </section>
    )

    return content
}
export default Signin