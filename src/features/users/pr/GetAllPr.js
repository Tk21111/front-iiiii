import React, { useState , useEffect} from "react";
import { useGetAllInfoUserMutation, useGetAllUserQuery } from "../NoteApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/Header";
import searchIcon from "../../../components/img/search.png"; // Import image
import Chart from "react-google-charts";

const GetAllUserAdmin = () => {
    const { userId } = useParams(); // Extract userId properly
    const navigate = useNavigate();

    const { data, isLoading, isSuccess } = useGetAllUserQuery(); // Call the hook properly
    const [getInfo, { data: dataList }] = useGetAllInfoUserMutation();
    const [hasFetched, setHasFetched] = useState(false);

    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState("null");
    const [page, setPage] = useState(0);


    if (isLoading) return <p>Loading...</p>;
    if (!isSuccess || !data) return <p>Error loading users</p>;

    // Filtering data safely
    let dataFilter = data;
    console.log(searchType);
    if(searchType !== "null"){
        dataFilter = data.filter((val) => val.roles.includes(searchType));
    }
    dataFilter = dataFilter.filter((val) => val.username.includes(search)); 

    console.log(dataFilter);        

    let content = dataFilter.map((i) => (
        <div class="food-waste-item" style={{height : '150px'}} >
            <div className='food-waste-front'>
                <div class="food-waste-date-badge"  style={{height : '35px' , fontSize: '70%' , justifyContent: 'center'}} >{i?.username.slice(0,10)}</div>
                <img src={require('../../../components/img/meal.png')} alt="meat icon" loading="lazy" className='smalllogolist' />
            </div>
                <div class="food-waste-content">
                        <div class="food-waste-details" style={{fontSize : '55%'}}>
                            <ul>
                                <li><h2>{"Realname : " + (i?.name || "no data")}</h2></li>
                                <li><h2>{"age : " + (i?.age || "no data")}</h2></li>
                                <li><h2>{"Aka : " + (i?.aka || "no data")}</h2></li>
                                <li><h2>{"More : " + (i?.more?.slice(0,10) || "no data")}</h2></li>
                                 
                                <div>
                                    <li><p onClickCapture={()=> navigate(`getuser/${i._id}`)} style={{ textDecoration: 'underline' }}>view all</p></li>
                                </div>
                            </ul>
                            
                        </div>
                </div> 
            </div>
    ));

    // Pagination
    
    const itemsPerPage = 20;
    const lContent = Math.ceil(content.length / itemsPerPage);
    content = content.slice(page * itemsPerPage, (page + 1) * itemsPerPage); 

    return (
        <div className="page">
            <Header />

            {/* Search Component */}
            <div className="search">
                <img src={searchIcon} alt="Search Icon" style={{ marginLeft: "8px" }} />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <select className="selection" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                <option value="User">user</option>
                <option value="org">org</option>
                <option value="null">all</option>
            </select>
            {/* End Search Component */}
            <div className="user-list-parent">{content}</div>
            <div className="page-control">
                <button onClick={() => setPage(page - 1)} disabled={page === 0}>
                {"<"}
                </button>
                <button
                onClick={() => setPage(page + 1)}
                disabled={page + 1 > lContent}
                >
                {">"}
                </button>
            </div>
        </div>

    );
};

export default GetAllUserAdmin;
