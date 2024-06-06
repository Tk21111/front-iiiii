import { Link } from "react-router-dom"

const Public = () => {

    const content = (
        <section className="public">
            <header>
                <h1>Welcome to randomNumber page for something Christmas ig.</h1>
            </header>
            <main>
                <p>This have been plan over a year in advance 

                    now it ready to use maybe we'll see what gonna happen
                    
                    ps. if u have any problem with unauthorized page just go back i'm tooo lazy to build verified role in frontend 
                </p>
                <p2>btw i don't know how CSS work so don't mind me</p2>
            </main>
            <footer>
                <Link to="/login">login or registor </Link>
            </footer>
        </section>

    )
    return content
}
export default Public