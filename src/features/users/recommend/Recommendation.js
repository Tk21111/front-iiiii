import { useEffect, useState } from 'react';
import { useGetAllNoteUserMutation, useGetHowQuery } from '../NoteApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../auth/authSlice';
import PostsExcerpt from '../NotesExcerpt';
import {listNew as menu} from '../comp/menu';
import { Link } from 'react-router-dom';
import Header from '../../../components/Header';
import Overay from '../../../components/Overlay';


const Recommend = () => {
    const username = useSelector(selectCurrentUser);
    const user = { username };
    const  { data , isLoading : Loading , isSuccess: done} = useGetHowQuery();
    const [getAllNoteUser, { isLoading, isSuccess, isError, error }] = useGetAllNoteUserMutation();
    const [hasFetched, setHasFetched] = useState(false);
    const [listSorted, setListSorted] = useState([]);
    const [dataFliter, setDataFliter] = useState(null);
    const [search , setSearch] = useState('');
    const [searchType , setSearchType] = useState('name')

    
    useEffect(() => {
        const howtoData = async () => {
          
            const Tmp = data?.map(obj => [obj.tag , [{name : obj.food, id : obj._id}]])
            console.log(Tmp)
            setDataFliter(Tmp)
            
        };

        howtoData();
    }, [data, Loading])
    
    useEffect(() => {

        
        const fetchData = async () => {
        
            if (!hasFetched && done &&dataFliter) {
                try {
                    
                    const dataApi = await getAllNoteUser(user);
                    
                    setHasFetched(true);
                    const { ids, entities } = dataApi.data;

                    let tagList =[];
                    for (let i of ids){
                        //get entities tag
                       
                        if(entities[i]?.tag){
                            if(entities[i]?.tag?.length >0){
                                tagList.push(...entities[i].tag);
                            } else {
                                if((entities[i].count || 0) - (entities[i].countExp || 0) ){
                                    tagList.push(entities[i].tag)
                                }                       
                            }
                        }
                    }
                    //del dupilcate
                    tagList = new Set(tagList);
                    tagList = new Array(...tagList);
                    
                    //add user custome menu
                    
                    let menuAll = menu;
                    //concat didn't work
                    //add all menu 
                    if(dataFliter){
                        menuAll = [...menu , ...dataFliter]
                        
                    }
                    
                    let Tmp = [];
                        for (let mena of menuAll){
                            const m = mena[0].map((tagMenu) => tagList.includes(tagMenu))
                            const haveTag = m.map(( tagTF ,index) => tagTF ? mena[0][index] : null).filter(item => item !== null);;
                            const notHaveTag = m.map(( tagTF ,index) => !tagTF ? mena[0][index] : null).filter(item => item !== null);;
                            Tmp.push([ mena[1].map(val => val.name) ,mena[1], haveTag , notHaveTag ,haveTag.length ])
                        }
                    Tmp.sort((a,b) => b[4] - a[4]);
                    setListSorted(Tmp)
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
                
            }
        };
        
       
        fetchData();
    }, [ hasFetched , data, getAllNoteUser, dataFliter]);

    let content = [];

    if (isLoading) {
        content = <p>Loading...</p>;
    } else if (isSuccess && hasFetched && listSorted) {

        
        if (listSorted){
                const filterList = listSorted
              
                

                for (let o of filterList){
                    //[[name],["obj"],[have],[nothave],length]
                    
                    let oo;
                    if(search){
                        if('name' === searchType){
                            oo = o[1].filter((name) => name.name.includes(search)).map((_, index) => 
                                <a href={`/recommend/${o[1][index]?.id}`} className="food-waste-item" style={{ color: 'black', display: 'flex', alignItems: 'center' , textDecoration: 'none' }}>
                                    <div className='food-waste-front'>
                                        <img src='./home.png' alt="meat icon" className='smalllogolist' />
                                    </div>
                                    <div className="food-waste-content" style={{ flex: 1, marginLeft: '10px' }}>
                                        <div className="food-waste-details" style={{ width: '100%' }}>
                                            <p>{o[1][index]?.name}</p>
                                            <ul>
                                            {o[2]?.map((i, idx) => (
                                                        <li style={{color: '#47BA01'}} key={idx}>{i}</li>
                                                    ))}
                                            </ul>
                                            <ul>
                                            {o[3]?.map((i, idx) => (
                                                        <li style={{color: '#B1AFAF'}}key={idx}>{i}</li>
                                                    ))}
                                            </ul>
                                            
                                            <div style={{
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                width: '150px',
                                                textAlign : 'start',
                                                fontSize: '20px'  // Set a fixed width to control where ellipsis applies
                                            }}> 
                                            </div>
                                            
                                        </div>
                                    </div>
                                </a> 
                        );
                        } else if ('tag' === searchType){
                            if(o[2].some(val => val.includes(search)) ||o[3].some(val => val.includes(search))){
                                
                                if(o[0].length >0){
                                    oo = []
                                    o[0].forEach((_ ,index) => {
                                       
                                        oo.push(<a className="food-waste-item" href={`/recommend/${o[1][index]?.id}`}style={{ color: 'black', display: 'flex', alignItems: 'center' , textDecoration: 'none'  }}>
                                    <div className='food-waste-front'>
                                        <img src='./home.png' alt="meat icon" className='smalllogolist' />
                                    </div>
                                    <div className="food-waste-content" style={{ flex: 1, marginLeft: '10px' }}>
                                        <div className="food-waste-details" style={{ width: '100%' }}>
                                            <p>{o[1][index]?.name}</p>
                                            <ul>
                                            {o[2]?.map((i, idx) => (
                                                        <li style={{color: '#47BA01'}} key={idx}>{i}</li>
                                                    ))}
                                            </ul>
                                            <ul>
                                            {o[3]?.map((i, idx) => (
                                                        <li style={{color: '#B1AFAF'}}key={idx}>{i}</li>
                                                    ))}
                                            </ul>
                                            
                                            <div style={{
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                width: '150px',
                                                textAlign : 'start',
                                                fontSize: '20px'  // Set a fixed width to control where ellipsis applies
                                            }}> 
                                                
                                            </div>
                                            
                                        </div>
                                    </div>
                                </a>)
                                    });
                                }
                            }else {
                                continue
                            }
                        }
                    } else {
                        //[name, o[1][index] , o[2] , o[3] , o[4]] 
                        console.log(o)
                        oo = o[0].map((_ ,index) =>  
                            <a className="food-waste-item" href={`/recommend/${o[1][index]?.id}`} style={{ color: 'black', display: 'flex', alignItems: 'center' , textDecoration: 'none' }}>
                        <div className='food-waste-front'>
                            <img src='./home.png' alt="meat icon" className='smalllogolist' />
                        </div>
                        <div className="food-waste-content" style={{ flex: 1, marginLeft: '10px' }}>
                            <div className="food-waste-details" style={{ width: '100%' }}>
                                <p>{o[1][index]?.name}</p>
                                <ul>
                                {o[2]?.map((i, idx) => (
                                            <li style={{color: '#47BA01'}} key={idx}>{i}</li>
                                        ))}
                                </ul>
                                <ul>
                                {o[3]?.map((i, idx) => (
                                            <li style={{color: '#B1AFAF'}}key={idx}>{i}</li>
                                        ))}
                                </ul>
                                
                                <div style={{
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    width: '150px',
                                    textAlign : 'start',
                                    fontSize: '20px'  // Set a fixed width to control where ellipsis applies
                                }}> 
                                    
                                </div>
                                
                            </div>
                        </div>
                    </a> 
                        )
                    }

                    content.push(oo)
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
        <div className='page'>
            <Header />
            <div className='content' >
                <img src={require('../../../components/img/star.png')} alt="star" className="smalllogo"/>
                <p style={{ marginRight : 'auto'}} className='welcomefont'><Link to="/recommend" >Menu Recommendation</Link></p>
            </div>

            {/* search comp */}
            <div className="search">
                <img src={require('../../../components/img/search.png')} alt="icon" style={{ marginLeft: '8px' }} />
                <input 
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)} 
                    placeholder="Search..." 
                />
            </div>
    
            <select
                className="selection"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
            >   
                <option value="text">Text</option>
                <option value="tag">Tag</option>
            </select>
            {/* end search comp */}

            <Overay link={'recommend/create'}/>
            
            <div className='user-list-parent'>{content}</div> {/* Ensure content is defined */}
        </div>
    );
    
};

export default Recommend;

