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
                    
                    <p>this is still in development please use with caution</p>
                    <p>เว็บไซด์ที่ยังอยู่ในการพัฒนา โปรดใช้ด้วยความระวัง</p>
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