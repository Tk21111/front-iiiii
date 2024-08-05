import { useEffect, useState } from 'react';
import { useGetAllNoteUserMutation } from './NoteApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../auth/authSlice';
import PostsExcerpt from './NotesExcerpt';
import list from './menu';
import { Link } from 'react-router-dom';

const GetAllNoteUser = () => {
    const username = useSelector(selectCurrentUser);
    const user = { username };
    const [getAllNoteUser, { isLoading, isSuccess, isError, error }] = useGetAllNoteUserMutation();
    const [hasFetched, setHasFetched] = useState(false);
    const [listSorted, setListSorted] = useState();
    const [search , setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!hasFetched) {
                try {
                    
                    const dataApi = await getAllNoteUser(user);
                    
                    setHasFetched(true);
                    const { ids, entities } = dataApi.data;
                    
                    let sorted = [];
                    for (let i of ids) {
                        let e = entities[i];
                        
                        if (e.tag) {
                            for (let y of e.tag) {
                                sorted.push(y);
                            }
                        }
                    }
                    
                    const listTmp = Object.keys(list).filter(val => {
                        return sorted.some(l => l === val);
                    });
                    
                    const haveList = listTmp.length > 0 ? listTmp : undefined;
                    if (haveList) {
                        let valueList = []
                        for (let f of haveList){

                            let valueObj = list[f];
                            valueList = valueList.concat(valueObj)
                            
                        }
                        setListSorted(valueList)
                        
                    } else {
                        setListSorted([])
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [getAllNoteUser, hasFetched]);

    let content;

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess && hasFetched && listSorted) {

        console.log(listSorted)
        if (listSorted){
            if (search){        
                const filterList = listSorted.filter(val => val.includes(search))
                const i = filterList.map(val => <article>{val}</article>)
                content = <p>{i}</p>
            } else {
                const i = listSorted.map(val => <article>{val}</article>)
                content = <p>{i}</p>
            }
        } else {
            content = <p>blank (nothing match)</p>
        }
        
        
        
        //content = listSorted.map((item, index) => <PostsExcerpt key={index} postId={item} />);
    } else if (isError) {
        let msg;
        if (error.status === 403) {
            msg = "Access denied. Go get a random number first.";
            <Link to="/login">Back to Welcome</Link>
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
            </div>
            {content}
            
        </div>
    );
};

export default GetAllNoteUser;