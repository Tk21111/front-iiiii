import React , {useState , useEffect} from 'react';
import { useGetUserMutation } from '../NoteApiSlice' ;
import { useParams } from 'react-router-dom';
import Header from '../../../components/Header';

const GetUser = () => {

    const userId = useParams()

    const [getUser , { data, isLoading, isSuccess, isError, error }] = useGetUserMutation();
    const [hasFetched, setHasFetched] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!hasFetched) {
                    await getUser({userId : userId.userId});
                    setHasFetched(true);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [ hasFetched]);

    
    const imagePath = data?.image?.map(p => p?.url)
    return (
        <div className='page'>
          <Header/>
          <div className='single-parent'>
            {imagePath && imagePath.length > 0 ? (
              imagePath.map((path, i) => (
                <img
                  key={i}
                  src={path}
                  alt={`note image ${i}`}
                  style={{ flexGrow: 1, maxWidth: 300, maxHeight: 300, margin: "5%" }}
                />
              ))
            ) : (
              <p>no image</p>
            )}
            <h2>{"name : " + (data?.username || 'no data')}</h2>
            <h2>{"aka : "+ (data?.aka || 'no data')}</h2>
            <p>{"more : " + (data?.more || 'no data')}</p>
          </div>
        </div>
      );
      
}

export default GetUser