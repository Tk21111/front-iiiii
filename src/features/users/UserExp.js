import { useEffect, useState } from "react";
import { useGetAllnoteQuery } from "./NoteApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";


import { Link } from "react-router-dom";
import Header from "../../components/Header";








const GetAllNoteUserExp = () => {


    const user = { username: useSelector(selectCurrentUser) };
    const  { data, isLoading, isSuccess, isError, error } = useGetAllnoteQuery(('noteUser', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    }));
    const [hasFetched, setHasFetched] = useState(false);

    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("text");

    let content;

  
    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess) {
        //this is what u have to modifine
        //data = { ids , entities}
        //content is list because str didn't work
        content = []

        let dateDiff = {};

        // Loop through each item in `data.ids`
        for (let i of data.ids) {
            const dataSingle = data.entities[i];
        
            // Convert `timeOut` to Date object
            const dt1 = new Date(dataSingle?.timeOut?.split('T')[0] || "2024-0-0");
            const dt2 = new Date();
        
            // Calculate the difference in days
            const diff = Math.floor(
                ((Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) - Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate())) / (1000 * 60 * 60 * 24)
            );
        
            // Initialize an array for each difference value if not already present
            if (!dateDiff[diff]) {
                dateDiff[diff] = [];
            }
        
            // Push `dataSingle` into the correct array
            dateDiff[diff].push(dataSingle);
        }
        
        
        const KEYDATEDIFF = Object.keys(dateDiff);
        
        
        // Loop through the keys (date differences)
        for (let f of KEYDATEDIFF) {
            let contentChild = [];
            // `dateDiff[f]` is an array of entities with the same date difference
            for (let j of dateDiff[f]) {
                // You can now work with each `j` (which is a single `dataSingle` object) to render HTML
                contentChild.push(
                    <a href={`/user/note/${j?.id}`} className="expchild" style={{textDecoration : 'none'}}>
                        <img src={j?.images.length > 0 ?`${process.env.REACT_APP_API}/${j?.images?.toString().replace(/\\/g, '/')}` : require('../../components/img/meal.png')} alt="pic" className="expimg"></img>
                        <p>{(j.text.length >= 5 ? j.text.substr(0,5) + "...": j.text)}</p>
                    </a>
                );
            }

            content.push(
                <div>
                    <div>
                        <h2 style={{fontSize : '30px' , marginTop : '2%'}}>{f <= 2 ? f == 1 ? f + " day!!!" : f + " days!" : f + " days" } </h2>
                    </div>
                    <div className="expcontainer">
                        {contentChild}
                    </div>
                </div>

            )
        }
        
        // If needed, you can join `contentChild` array into a string and use it in your HTML
        
        
        if (!data){
            content = <Link to="/user/note/create">Create yours own note</Link>;
        }
    } else if (isError) {
        let msg;
        if (error.status === 403) {
            msg = "Access denied. Go get a random number first.";
        } else {
            msg = JSON.stringify(error);
        }
        content = (
            <section>
                <h1>{msg}</h1>
                <Link to="/welcome">Back to Welcome</Link>
            </section>
        );
    }

    
    

    
        return (
            <div style={{width: '100%' , height: '100%'}}>
                <Header />
                
                <div className='content' >
                    <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/user" >Food Waste List</Link></p>
                </div>
                {content}
            </div>
        );
   
};

export default GetAllNoteUserExp;
