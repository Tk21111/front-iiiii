import { useParams , useNavigate} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useEffect, useState , useRef} from 'react';
import { useGetAlllocaQuery , useDeletelocaMutation} from './LocaApiSlice';
import {useSelector} from 'react-redux'
import { selectCurrentUser } from '../auth/authSlice';

const SingleLocaPage = () => {
    //obj 
    const locaId = useParams();
    const navigate = useNavigate();

    const { data , isLoading, isSuccess, isError, error } = useGetAlllocaQuery();
    const [ deleteLoca , {isLoading : isDeleting , isError : deleteErr}] = useDeletelocaMutation();
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
                setErrMsg("401 cannot delete location that isn't yours")
            }
            
        }
    }

    
    const imagePath = loca?.images?.map(p => { return `http://localhost:3500/${p.replace(/\\/g, '/')}`}) || [];
    
   

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
                <p>Town : {loca.town}</p>
                <p>Subdistrict : {loca.subdistrict}</p>
                <p>County : {loca.county}</p>
                <p>more: {loca.more ? loca.more : "Don't have more"}</p>
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