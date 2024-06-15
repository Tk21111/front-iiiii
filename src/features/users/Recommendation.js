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

    useEffect(() => {
        const fetchData = async () => {
            if (!hasFetched) {
                try {
                    console.log(user);
                    const dataApi = await getAllNoteUser(user);
                    console.log(dataApi.data);
                    setHasFetched(true);
                    const { ids, entities } = dataApi.data;
                    console.log(ids);
                    let sorted = [];
                    for (let i of ids) {
                        let e = entities[i];
                        console.log(e);
                        console.log(e.tag); //obj
                        if (e.tag) {
                            for (let y of e.tag) {
                                sorted.push(y);
                            }
                        }
                    }
                    console.log(list);
                    console.log(sorted);
                    console.log(Object.keys(list))
                    const listTmp = Object.keys(list).filter(val => {
                        return sorted.some(l => l === val);
                    });
                    console.log(listTmp)
                    const haveList = listTmp.length > 0 ? listTmp : undefined;
                    if (haveList) {
                        let valueList = []
                        for (let f of haveList){
                            let valueObj = list[f];
                            console.log(valueObj)
                            valueList = valueList.concat(valueObj)
                            console.log(valueList)
                        }
                        setListSorted(valueList)
                        
                    } else {
                        setListSorted('None match')
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
        console.log(listSorted);
        content = listSorted.map(val => <p key={val}>{',' + val}</p>)
        //content = listSorted.map((item, index) => <PostsExcerpt key={index} postId={item} />);
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

    return content;
};

export default GetAllNoteUser;
