import { useEffect, useState } from "react";
import {
  useGetAllnoteQuery,
} from "./NoteApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../auth/authSlice";
import PostsExcerpt from "./NotesExcerpt";
import filterEntitiesByTag from "./comp/Search";


import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Overay from "../../components/Overlay";

const GetAllNoteUser = () => {
  const [page, setPage] = useState(0);
  const [showExp , setShowExp] = useState(false);

  const user = { username: useSelector(selectCurrentUser) };
  const { data: users, isLoading, isSuccess, isError, error } = useGetAllnoteQuery(
    ("noteUser",
    {
      pollingInterval: 15000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    })
  );
  const [hasFetched, setHasFetched] = useState(false);

  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("text");


  let content;
  let lContent;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    //this is what u have to modifine
    //user = { ids , entities}
    //content is list because str didn't work
    content = [];

    //disable expired 
    const timeNow = new Date()
    let filteredIds = users?.ids;
    if (!showExp) {
      filteredIds = users?.ids?.filter(id => new Date(users.entities[id].timeOut) > timeNow);
    }


    if (filteredIds.length !== 0 && !search) {
      for (let i of filteredIds) {
        content.push(<PostsExcerpt key={i} i={users.entities[i]} />);
      }
    } else if (search) {
      for (let i of filteredIds(
        filterEntitiesByTag(users.entities, search, searchType)
      )) {
        content.push(<PostsExcerpt key={i} i={users.entities[i]} />);
      }
    } else {
      content = <Link to="/user/note/create">Create yours own note</Link>;
    }
    //slice = nomal splice = (amount , lastElement)
    lContent = content.length / 24;
    content = content.length > 0 ? content?.slice(24 * page, 24 * (page + 1)) :  null  
} 
else if (isError) {
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

  return (
    <div className="page">
      <Header />
      <Overay link="user/note/create" />
      <div className="content">
        <img
          src={require("../../components/img/star.png")}
          alt="star"
          className="smalllogo"
        />
        <p style={{ marginRight: "auto" }} className="welcomefont">
          <Link to="/user" style={{textDecoration : 'none'}}>Food Waste List</Link>
        </p>
      </div>
      <div className="food-waste-list">
        {/* search comp*/}
        <div className="search">
          <img
            src={require("../../components/img/search.png")}
            alt="icon"
            style={{ marginLeft: "8px" }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        <label htmlFor="postDone">Show Exp</label>
          <input
            type="checkbox"
            id="showExp"
            name="showExp"
            checked={showExp}
            onChange={(e) => setShowExp(e.target.checked)}
          />
        {/*end search comp*/}
      </div>
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

export default GetAllNoteUser;
