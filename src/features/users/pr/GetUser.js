import React, { useState, useEffect } from "react";
import { useGetAllInfoUserMutation, useGetUserMutation } from "../NoteApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/Header";
import Chart from "react-google-charts";

const GetUser = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [getUser, { data, isLoading, isSuccess, isError, error }] = useGetUserMutation();
    const [getInfo, { data: dataList }] = useGetAllInfoUserMutation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUser({ userId });
                await getInfo({ user: userId });
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, [userId, getUser, getInfo]);

    const imagePath = data?.image?.map((p) => p?.url) || [];

    console.log(dataList);

    return (
        <div className="page">
            <Header />
            <div className="single-parent">
                {/* User Images */}
                {imagePath.length > 0 ? (
                    imagePath.map((path, i) => (
                        <img
                            key={i}
                            src={path}
                            alt={`note image ${i}`}
                            style={{ flexGrow: 1, maxWidth: 300, maxHeight: 300, margin: "5%" }}
                        />
                    ))
                ) : (
                    <p>No image</p>
                )}

                <div className="content" style={{border : "black solid 2px" , borderRadius : "20px" }}>
                    {/* User Info */}
                    <div className="overcontent" style={{maxWidth : '20%'}}>
                        <h2>Name: {data?.username || "No data"}</h2>
                        <h2>Aka: {data?.aka || "No data"}</h2>
                        <p>More: {data?.more || "No data"}</p>
                    </div>
                    {/* Chart */}
                    <div className="overcontent" style={{width : '50%'}}>
                        {dataList?.[0]?.length >= 2 ? (
                            <Chart
                                chartType="PieChart"
                                data={[
                                    ["Type", "Value"],
                                    ["Buy", dataList?.[0]?.[0] || 0],
                                    ["Expire", dataList?.[0]?.[1] || 0],
                                ]}
                                width="100%"
                                height="400px"
                            />
                        ) : (
                            <p>No chart data available</p>
                        )}
                    </div>
                </div>
                

                {/* Stats */}
                <div className="overcontent-top">
                    <h2>Loca stat: {dataList?.[1] + " obj"|| "No data"}</h2>

                </div>

                {/* Recommendations */}
                <div className="content">
                        <div className="overcontent-top" style={{maxWidth : '50%'}}>
                            {dataList?.[2]?.length > 0 && (
                        <div>
                            <h3>RECOMMENDs:</h3>
                            <ul>
                                {dataList[2].map((val) => (
                                    <li key={val._id}>
                                        <p onClick={() => navigate(`/recommend/${val._id}`)} style={{ textDecoration: "underline", cursor: "pointer" }}>
                                            View all
                                        </p>
                                        {val.name}
                                        {val.createdAt?.split("T")[0]}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    </div>
                    <div className="overcontent-top" style={{maxWidth : '50%' }}>
                        {/* Posts */}
                        {dataList?.[3]?.length > 0 && (
                            <div>
                                <h3>POSTs:</h3>
                                <ul>
                                    {dataList[3].map((val) => (
                                        <li key={val._id}>
                                            <p onClick={() => navigate(`/post/true/${val._id}`)} style={{ textDecoration: "underline", cursor: "pointer" }}>
                                                View all
                                            </p>
                                            <li>{val.content}</li>
                                            <li>{val.createdAt?.split("T")[0]}</li>
                                            
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                

                
            </div>
        </div>
    );
};

export default GetUser;
