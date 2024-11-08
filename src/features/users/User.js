import { useEffect, useState } from "react";
import { selectAllNotes, selectNoteById, useGetAllNoteUserMutation } from "./NoteApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import PostsExcerpt from "./NotesExcerpt";
import filterEntitiesByTag from "./comp/Search";

import ReactDom from 'react-dom';

import { Link, useParams } from "react-router-dom";
import Header from "../../components/Header";
import Overay from "../../components/Overlay";

const GetAllNoteUser = () => {

    
    const user = { username: useSelector(selectCurrentUser) };
    const [getAllNoteUser , { data: users, isLoading, isSuccess, isError, error }] = useGetAllNoteUserMutation(('noteUser', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    }));
    const [hasFetched, setHasFetched] = useState(false);

    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("text");

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!hasFetched) {
                    await getAllNoteUser(user);
                    setHasFetched(true);
                    console.log('f')
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [ hasFetched]);

    let content;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess) {
        //this is what u have to modifine
        //user = { ids , entities}
        //content is list because str didn't work
        content = []

        if (users.ids.length !== 0 && !search) {
            
            for (let i of users.ids) {
                content.push(<PostsExcerpt key={i} i={users.entities[i]} />);
            }
            console.log(content)
            //content = users.ids.map(postId => <PostsExcerpt key={postId} postId={postId} />)
        } else if (search) {
            for (let i of Object.keys(filterEntitiesByTag(users.entities, search, searchType))) {
                content.push(<PostsExcerpt key={i} i={users.entities[i]} />);
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

    console.log(useSelector(selectNoteById))

        return (
            <div className="page">
                <Header />
                <Overay link="user/note/create" />
                <div className='content' >
                    <img src={require('../../components/img/star.png')} alt="star" className="smalllogo"/>
                    <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/user" >Food Waste List</Link></p>
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
                {content}
            </div>
        );
   
};

export default GetAllNoteUser;
