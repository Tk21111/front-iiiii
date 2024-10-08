import React , {useState , useEffect} from 'react';
import { useGetUserMutation } from './NoteApiSlice' ;
import { useParams } from 'react-router-dom';

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

    console.log(data)
    
    const imagePath = data?.image?.map(p => { return `http://localhost:3500/${p.replace(/\\/g, '/')}`}) || [];
   

    return (
        <div>
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
          <p>{data?.username}</p>
          <p>{data?.more}</p>
        </div>
      );
      
}

export default GetUser