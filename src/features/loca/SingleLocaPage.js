import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGetAlllocaQuery } from './LocaApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice';

const SingleLocaPage = () => {

    const locaId = useParams();
    console.log(locaId);
    const { data , isLoading, isSuccess, isError, error } = useGetAlllocaQuery();
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);

    const [loca , setLoca] = useState('');
    const [text, setText] = useState('');

    useEffect(() => {
        if (!isLoading) {
            setLoading(false);
        }
    }, [isLoading]);

    useEffect(() => {
        if (data && data.entities) {
            const loca = data.entities[locaId.noteId];
                setLoca(loca)
            if (loca) {
                setText(loca.text);
            } else {
                setText('Have been deleted');
            }
        }
    }, [data, locaId]);

    const handleRefresh = () => {
        setLoading(true);
        setRefresh(prev => prev + 1); // This will trigger a re-fetch
    };
    if (isLoading) return <p>Loading...</p>
    console.log(loca)
    if (!data) {
        return (
            <section>
                <h2>loca not found!</h2>
            </section>
        )
    }

    return (
        <article>
            <h2>{text}</h2>
            <p>Town : {loca.town}</p>
            <p>Subdistrict : {loca.subdistrict}</p>
            <p>County : {loca.county}</p>
            <p>more: {loca.more ? loca.more : "Don't have more"}</p>
            <p className="postCredit">
                <Link to={`/location/edit/${locaId.noteId}`}>Edit Post</Link>
            </p>
        </article>
    )
}

export default SingleLocaPage