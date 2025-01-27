import { useEffect, useState } from 'react';
import { useGetOrgQuery } from '../users/NoteApiSlice';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import LocasExcerptOrg from './LocaExcerptOrg';
import { Alert } from '@mui/material';
import filterEntitiesByTag from '../users/comp/Search';

const GetOrg = () => {
    const { data: users, isLoading, isSuccess, isError, error } = useGetOrgQuery();

    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [searchType, setSearchType] = useState('username');

    const filterContent = () => {
        const filteredEntities = search
            ? filterEntitiesByTag(users.entities, search, searchType, false)
            : users.entities;

        return Object.keys(filteredEntities).map((id) => (
            <LocasExcerptOrg key={id} i={filteredEntities[id]} own={false} />
        ));
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (isError) {
        const msg = error.status === 400 ? "No org to donate yet" : JSON.stringify(error);
        return (
            <section>
                <h1>{msg}</h1>
                <Link to="/welcome">Back to Welcome</Link>
            </section>
        );
    }

    const allContent = isSuccess ? filterContent() : [];
    const paginatedContent = allContent.slice(24 * page, 24 * (page + 1));
    const totalPages = Math.ceil(allContent.length / 24);

    alert("This is just a demo นี่คือ ตัวทดลอง ไม่สามารถบริจาคให้ได้จริง หากต้องการ => https://cloudfoodbank.org/; Cloudfoodbank")

    return (
        <div className="page">
            <Header />
            <div className="content">
                <img src={require('../../components/img/star.png')} alt="star" className="smalllogo" />
                <p className="welcomefont">
                    <Link to="/location/oforg">Food - Sharing</Link>
                </p>
            </div>
            {/* Search Component */}
            <div className="search">
                <img src={require('../../components/img/search.png')} alt="icon" className="search-icon" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                />
                <select
                    className="selection"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                >
                    <option value="username">username</option>
                    <option value="aka">aka</option>
                </select>
            </div>
            {allContent.length === 0 ? (
                <Alert severity="info">No results found</Alert>
            ) : (
                <div className="user-list-parent">{paginatedContent}</div>
            )}
            {/* Pagination */}
            <div className="page-control">
                <button onClick={() => setPage(page - 1)} disabled={page === 0}>
                    {"<"}
                </button>
                <button onClick={() => setPage(page + 1)} disabled={page + 1 >= totalPages}>
                    {">"}
                </button>
            </div>
        </div>
    );
};

export default GetOrg;
