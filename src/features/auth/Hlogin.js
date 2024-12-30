import { useRef, useState, useEffect } from 'react'
import { useNavigate , Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'

const Login = () => {
    const userRef = useRef() //set focus on userinput
    const errRef = useRef()
    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [persist , setPersist] = usePersist()
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()
    

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const userData = await login({ user, pwd }).unwrap()
            //diffrent the ...userData is a accessToken
            console.log({...userData , user})
            dispatch(setCredentials({ ...userData, user }))
            localStorage.setItem("login" , userData.refreshToken )
            setUser('')
            setPwd('')
            navigate('/welcome')
        } catch (err) {
            if (!err?.originalStatus) {
                // isLoading: true until timeout occurs
                setErrMsg('No Server Response');
            } else if (err.originalStatus === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.originalStatus === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed pls wait or change username');
            }

            if (errRef.current) return errRef.current.focus();
            
        }
    }

    const handleUserInput = (e) => setUser(e.target.value)
    const handlePwdInput = (e) => setPwd(e.target.value)
    const handleToggle = () => setPersist(prev => !prev)

    const content = isLoading ? <h1>Loading...</h1> : (
        <div className='page'>
            <section className="login">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> 

                <h1 className='welcomefont' style={{color : '#FFE55F'}}>Log in</h1>

                <form onSubmit={handleSubmit}> 
                    <label htmlFor="username"  className='welcomefont' style={{color : '#F9AEFF'}} >Username:</label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        value={user}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                    />

                    <label htmlFor="password"  className='welcomefont' style={{color : '#F9AEFF'}}>Password:</label>
                    <input
                        type="password" //doesn't show it 
                        id="password"
                        onChange={handlePwdInput}
                        value={pwd}
                        required
                    />

                    <label htmlFor="persist" className='welcomefont' style={{color : '#B0E7FF'}}>
                        <input
                            type="checkbox"
                            className="form__checkbox"
                            style={{width : '5%' , height : '100%'}}
                            id="persist"
                            onChange={handleToggle}
                            checked={persist}
                            required
                        />
                        Trust this device
                    </label>
                    <button className='buttonCF'>เข้าสู่ระบบ</button>
                </form>
                <div style={{display : 'flex' , justifyContent: 'center' , marginTop : '3%'}}>
                    <button onClickCapture={() => navigate('/registor')} className='buttonCF' style={{color : '#B0E7FF' , backgroundColor : '#F9AEFF'}}>ลงทะเบียน</button>
                </div>
            </section>
            
        </div>
    )

    return content
}
export default Login