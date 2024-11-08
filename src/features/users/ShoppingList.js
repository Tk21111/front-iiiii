import { useEffect, useState } from "react";
import { useGetAllNoteUserMutation, useGetHowQuery } from "./NoteApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import PostsExcerpt from "./NotesExcerpt";
import filterEntitiesByTag from "./Search";

import ReactDom from 'react-dom';

import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Overay from "../../components/Overlay";
import NotesExcerptSmall from "./NotesExcerptSmall";
import HowExcerpt from "./how/HowExcerpt";


const ShoppingList = () => {

    const {select , donate , name ,  post} = useParams();

    const user = { username: useSelector(selectCurrentUser) };
    const [getAllNoteUser , { data: users, isLoading, isSuccess, isError, error }] = useGetAllNoteUserMutation(('noteUser', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    }));

    const {data : how , isSuccess : howSucess , isLoading : howLoading } = useGetHowQuery()
    const [hasFetched, setHasFetched] = useState(false);

    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("text");

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!hasFetched) {
                    if(post.split("=")[0] === 'food'){
                        await getAllNoteUser(user);
                        setHasFetched(true);
                    } 
                    console.log('f')
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [ hasFetched]);

    let content;


    if (isLoading || howLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess || howSucess) {
       
        content = []
        console.log(post.split("=")[0] == 'how')
        if(post.split("=")[0] == 'how'){

            console.log(how.map(val => <HowExcerpt key={val._id} i={val} donate={false} select={false} name={null} post={post} />))
            content = how.map(val => <HowExcerpt key={val._id} i={val} donate={false} select={false} name={null} post={post} />)

        }
         //this is what u have to modifine
        //user = { ids , entities}
        //content is list because str didn't work
        
        else if  (users.ids.length !== 0 && !search) {
            
            for (let i of users.ids) {
                content.push(<NotesExcerptSmall key={i} i={users.entities[i]} donate={donate} select={select} name={name} post={post}/>);
            }
            console.log(content)
        } else if (search) {
            for (let i of Object.keys(filterEntitiesByTag(users.entities, search, searchType))) {
                content.push(<NotesExcerptSmall key={i} i={users.entities[i]} donate={donate} select={select} name={name} post={post} />);
            }
            console.log(content);
        } else {
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
            <div className="page">
                <Header />
                <Overay link="/user/note/create" />
                
                <div className='content' >
                    <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/user/shopping/false/false/null" > ShoppingList </Link></p>
                </div>
                <div className="food-waste-list">
                {/* search comp*/}
                <div className="search">
                    <img src={require('../../components/img/search.png')} alt="icon" style={{marginLeft : '8px'}}/>
                    <input type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}/>
                </div>
                    <select
                        className="selection"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        
                    >   
                        <option value="text">Text</option>
                        <option value="tag">Tag</option>
                    </select>
                </div>
                {/*end search comp*/}
                <div className="container-shopping">
                    {content}
                </div>
            </div>
        );
   
};

export default ShoppingList;
