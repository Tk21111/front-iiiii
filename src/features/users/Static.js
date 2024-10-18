import { useEffect, useState } from "react";
import { useGetAllNoteUserMutation } from "./NoteApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import { Chart } from "react-google-charts";

import BuyExcerpt from "./BuyExcerpt";
import filterEntitiesByTag from "./Search";

import { Link } from "react-router-dom";
import Header from "../../components/Header";


const Static = () => {
    const user = { username: useSelector(selectCurrentUser) };
    const [getAllNoteUser , { data: users, isLoading, isSuccess, isError, error }] = useGetAllNoteUserMutation();
    const [hasFetched, setHasFetched] = useState(false);

    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("text");

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!hasFetched && !users) {
                    await getAllNoteUser(user);
                    setHasFetched(true);
                    
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [hasFetched]);

    let content;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess) {
        //this is what u have to modifine
        //user = { ids , entities}
        //content is list because str didn't work
        content = []
        let tagEn = {};
        let inEn;
        if (search){
            inEn = filterEntitiesByTag(users.entities , search, searchType , false );
        } else{
            inEn = users.entities
        }

        //get taggg from entities and assigned
        for (let f of Object.keys(inEn)){ 

            let tag = inEn[f].tag;
            //let tag = ObjEn.tag;

            //content = {tag : obj}
            tagEn[tag] = filterEntitiesByTag(inEn, tag, 'tag' , true);

            //get tag into entities
            tagEn[tag]['tag'] = tag;

        }

        

        //get into article
        for (let i of Object.keys(tagEn)){     
            content.push(<BuyExcerpt key={i} i={tagEn[i]} />);
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
        <div className="page">
            <Header/>
            <div className='content' >
                <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/static" >Statistics</Link></p>
            </div>
            {/* search comp */}
            <div className="search">
                    <img src={require('../../components/img/search.png')} alt="icon" style={{ marginLeft: '8px' }} />
                    <input 
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)} 
                        placeholder="Search..." 
                    />
                </div>
                <div>
                    <select
                            className="selection"
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="food">Food</option>
                            <option value="tag">tag </option>
                            
                        </select>
                </div>
                {/* end search comp */}
                {content}
        </div>
    );
};

export default Static;
