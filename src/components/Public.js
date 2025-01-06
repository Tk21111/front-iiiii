import { Link, useNavigate } from "react-router-dom"
import Header from "./Header"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "../features/auth/authSlice"
import { useEffect } from "react"

const Public = () => {

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("login")){
            navigate('welcome')
        }
    },[])

    const content = (
        <div className="page">
            <Header/>
            <section className="public">
                <header>
                    <h1>Welcome to food storage web.</h1>
                </header>
                <main>
                    <p>PLS PAY SO IT WORK
                    </p>
                    <p2>btw i don't know how CSS work so don't mind me</p2>
                </main>
                <footer>
                    <Link to="/login">login or registor </Link>
                </footer>
            </section>
        </div>

    )
    return content
}
export default Public