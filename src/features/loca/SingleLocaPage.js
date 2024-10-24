import { useParams , useNavigate} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useState , useRef} from 'react';
import { useGetAlllocaQuery , useDeletelocaMutation, useDonatelocaMutation} from './LocaApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice';

const SingleLocaPage = () => {
    //obj 
    const locaId = useParams();
    const navigate = useNavigate();

    const { data , isLoading, isSuccess, isError, error } = useGetAlllocaQuery();
    const [ deleteLoca , {isLoading : isDeleting , isError : deleteErr}] = useDeletelocaMutation();
    const [donate , {isLoading : isDonating , isError : donateErr}] = useDonatelocaMutation();
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);
    const [errMsg , setErrMsg] = useState('');
    const errRef = useRef();

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
    if (isError) return <p>Can't find location sharing post</p>
    
    if (!data) {
        return (
            <section>
                <h2>loca not found!</h2>
            </section>
        )
    }

    const ondeletePostClicked = async(e) => {
        e.preventDefault();
        if(locaId.noteId){
            try {
                await deleteLoca({ id : locaId.noteId}).unwrap();
            navigate('/location')
            } catch (err) {
                console.log(err)
            }
            
        }
    }

    //go to that person
    const onDonateClicked = async (e) => {
        e.preventDefault();
        if (locaId.noteId) {
            try {
                const response = await donate({ id: locaId.noteId }).unwrap();
    
                // Assuming response was successful, navigate to '/location'
                navigate(`/getuser/${loca.user}`);
    
            } catch (err) {
                console.error(err);
    
                // Check the original status code from the error
                if (err.originalStatus === 401) {
                    setErrMsg("401 Unauthorized: Cannot delete location that isn't yours");
                } else if (err.originalStatus === 500) {
                    setErrMsg("500 Internal Server Error");
                } else {
                    setErrMsg("An unexpected error occurred");
                }
            }
        } else {
            setErrMsg("Note ID is missing");
        }
    };
    

    
    const imagePath = loca?.images?.map(p => { return `${process.env.REACT_APP_API}/${p.replace(/\\/g, '/')}`}) || [];
    
   

    return (
        <article>
            <h2 ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live="assertive">{errMsg}</h2>
            {imagePath.map((path, i) => (
                <img
                    key={i}
                    src={path}
                    alt={`note image ${i}`}
                    style={{ flexGrow: 1, maxWidth: 300, maxHeight: 300, margin: "5%" }}
                />
            ))}
            <div style={{margin: '2%'}}>
                <h2>{text}</h2>
                (<h1>{loca?.organisation ? "organisation!!!!" : "user"}</h1>)
                <p>Town : {loca?.town}</p>
                <p>Subdistrict : {loca?.subdistrict}</p>
                <p>County : {loca?.county}</p>
                <p>more: {loca?.more ? loca.more : "Don't have more"}</p>
                <button
                        type="button"
                        onClick={onDonateClicked}
                    >
                        Get from this person
                    </button>
                <button
                        type="button"
                        onClick={ondeletePostClicked}
                    >
                        Delete Post
                    </button>
                <p><Link to="/location"> Location List </Link></p>
                <p><Link to="/welcome"> Home </Link></p>
            </div>
        </article>
    )
}

export default SingleLocaPage