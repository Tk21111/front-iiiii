import { useEffect, useState } from 'react';
import { useGetAllNoteUserMutation } from './NoteApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice';
import PostsExcerpt from './NotesExcerpt'
import filterEntitiesByTag from './Search';

import { Link } from 'react-router-dom';

const GetAllNoteUser = () => {
    const user = { "username" : useSelector(selectCurrentUser)};
    const [getAllNoteUser, { data: users, isLoading, isSuccess, isError, error }] = useGetAllNoteUserMutation();
    const [hasFetched, setHasFetched] = useState(false);

    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('text');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!hasFetched) {
                    await getAllNoteUser(user);
                    setHasFetched(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [getAllNoteUser, hasFetched]);

    let content;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess) {


        //this is what u have to modifine
        //user = { ids , entities}
        console.log(users)

        if(users.ids.length !== 0 && !search ){
            content = users.ids.map(postId => <PostsExcerpt key={postId} postId={postId} />)
        } else if (search) {
            console.log(users.entities)
            const f = filterEntitiesByTag(users.entities , search , searchType)
            const key = Object.keys(f)
            content = key.map(postId => <PostsExcerpt key={postId} postId={postId} />)
            console.log(content)
        } else {
            content = <Link to="/user/note/create">Create yours own note</Link>
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
        <div>
            <p><Link to="/welcome"> Home </Link></p>
            <div>
                <label>
                    Search Query:
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>
                <label>
                    Search Type:
                    <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                        <option value="text">Text</option>
                        <option value="tag">Tag</option>
                    </select>
                </label>
            </div>
            {content}
        </div>
    );
};



export default GetAllNoteUser;