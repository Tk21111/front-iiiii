import React, { useEffect, useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import { selectCurrentUser } from '../auth/authSlice';
import { useSelector } from 'react-redux';
import { useGetSavePostQuery, useSavePostMutation, useSetLikeMutation } from './PostApiSlice';
import { translate } from '../../hooks/translator';

const PostsExcerpt = ({ i }) => {

    const username = useSelector(selectCurrentUser);

    const [setLikeApi] = useSetLikeMutation();
    const [savePost , {isSucess : saved}] = useSavePostMutation();


    const [likeList , setLikeList] = useState(i.like || []);
    const [unLikeList , setUnLikeList] = useState(i.unlike || []);

    const {data : savePostData } = useGetSavePostQuery();
    const [postSave , setPostSave] = useState([]);

    const navigate = useNavigate()

    useEffect(()=> {
        if(savePostData){
          setPostSave(savePostData)
        }
      },[savePostData])


    const handleLike = async (like) => {
        await setLikeApi({ id: {[i._id] : like} }).unwrap();
    };

    const handleSave = async () => {
        try {
          await savePost({id : i._id}).unwrap();
          // Optionally, navigate back to the post list or show a confirmation message
          
          if(postSave?.find(val => val._id === i._id)){
            //already have one
            setPostSave(postSave.filter(val => val._id !== i._id));
          } else {
            setPostSave([...postSave , i])
          }
          
        } catch (error) {
          console.error("Failed to delete post:", error);
        }
      };
    
    


    if (!i) {
        return <p>Location not found</p>;
    }

    const imageUserPath = i?.user?.image?.map(image => image?.url);

    return (
        <div className="food-waste-item" >
            <div className="food-waste-front">
                <img
                    src={imageUserPath ? imageUserPath[0] : require('../../components/img/home.png')}
                    alt="user icon"
                    className="smalllogolist"
                />
                <h2 className="user-aka">{i?.user.aka}</h2>
            </div>
            <div className="overcontent">
                <div className="food-waste-content">
                    <div className="food-waste-details">
                        <h2>{i?.title}</h2>
                        <p>{i?.content.substr(0,20)}</p>
                        <h2>{likeList.length - unLikeList.length}</h2>
                        <h2 onClickCapture={() => navigate(i?.id || "/post/false/" +i?._id)}>view all</h2>
                        <div className='post-single-like-comp'>
                            <button 
                                onClickCapture={() => 
                                    {
                                        if(likeList.find(val => val === username) ){ 
                                            {/*back to ori as already have like*/}
                                            handleLike(true);
                                           
                                            setLikeList(likeList.filter(val => val !== username))
                                        
                            
                                          } else {
                                            {/*set like*/}
                                            {/* api*/}
                                            handleLike(true);
                                           
                                            setLikeList([...likeList , username])
                                            setUnLikeList(unLikeList.filter(val => val !== username))
                    
                                          }
                                    }
                                    } 
                                className='post-single-like-comp-child'
                                style={{backgroundColor : ((likeList.find(val => val === username)) ? '#FFC0CB' : 'white') , border : 'black solid 1px' }}
                                >like</button>
                            <button 
                                onClickCapture={() => {
                                    if(unLikeList.find(val => val === username)){
                                        {/*set un unlike*/} 
                                        {/* api*/}
                                        handleLike(false);
                                
                                        setUnLikeList(unLikeList.filter(val => val !== username))
                                     
                        
                                      } else {
                                        {/* api*/}
                                        handleLike(false);
                
                                        setUnLikeList([...unLikeList , username])
                                        setLikeList(likeList.filter(val => val !== username))
                                      }
                                }} 
                                className='post-single-like-comp-child'style={{backgroundColor : ((unLikeList.find(val => val === username)) ? '#FFC0CB' : 'white') , border : 'black solid 1px' }}
                                >unlike</button>
                            <button 
                                className= 'post-single-like-comp-child'
                                style={{backgroundColor : (postSave?.find(val => val._id === i._id)) ? '#FFC0CB' : 'white' , border : 'black solid 1px' }} 
                                onClick={handleSave}>Save </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostsExcerpt;
