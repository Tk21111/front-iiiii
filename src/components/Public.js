import { Link } from "react-router-dom"
import Header from "./Header"

const Public = () => {

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