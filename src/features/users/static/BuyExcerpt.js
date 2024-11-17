import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllnoteQuery } from "../NoteApiSlice";
import { selectCurrentUser } from '../../auth/authSlice';
import { useSelector } from 'react-redux';

import Chart from 'react-google-charts';

const BuyExcerpt = ({ i }) => {
    const username = useSelector(selectCurrentUser);



    //key with tag
    let key = i ? Object.keys(i) : 0;

    let tag;
    if (Array.isArray(key)){
        tag = i.tag
        key.pop();
    
    if (key.length === 0){
        key = 'None found'
    }
    }
    
    let content = {};
    let list = [];
    let suggestion = 0;
    let amoutAll = 0
    let amoutExpAll = 0
    

    if ( key.length >= 1){
        //get entities of _id
        //get all of count and countExp        
        for (let f of key){
            try {
                let entities = i[f]
                const TmpExp = entities?.countExp
                for (f = 0 ; f <= entities?.countExp?.length -1 ; f++){
                    list.push([entities?.text + "(" + f + ")" , entities?.count[f] , entities?.countExp[f]]);
                }
                amoutAll += entities?.count[0];
                amoutExpAll += entities?.countExp[entities?.countExp?.length - 1];
            } catch (err){
                console.log(err)
            }
            
        }


    

    //obj {key : count , countExp}
    

        //setCount(countEn)
        //setCountExp(countExpEn)

        //logic something
        
    } 

    if (!i) {
        return <p>Loading...</p>;
    }

    if (amoutAll > amoutExpAll*999){
        suggestion = 'as much as you want'
    } else if (amoutAll > amoutExpAll){
        suggestion = "Maybe think again"
    } else if (amoutAll === amoutExpAll){
        suggestion = "I don't think u need this as much"
    } 

    
    

    const data=[
        ["Year", "Buying Amount", "Expired Amount"],
        ...list
    ];


    return (

        <article style={{justifyContent : 'center' , textAlign : 'center'}}>
            <h2>{tag}</h2>
            
            <Chart
                chartType="Bar"
                data={data}
                width="100%"
                height="400px"
                options={{
                    isStacked: true ,
                    legend: { position: 'none' },
                }}
                
            />
            <article className='centeredContainer'>
                <p style={{textAlign: 'center'}}>{"ที่ซื้อ" + ":" + "ที่เหลือ" }</p>
                <p style={{textAlign: 'center' , fontWeight : 'bold'}}>{amoutAll + ":" + amoutExpAll}</p>
            </article>
            <article className='centeredContainer'>
                <p style={{textAlign: 'start' , marginBottom: "10%"}}>{"คำแนะนำ" }</p>
                <p>{suggestion}</p>
            </article>
            
            
        </article>
    );
};

export default BuyExcerpt;

/*<article>
            <h2>{tag}</h2>
            <p>{JSON.stringify(content)}</p>
            <p>{'Buy ; ' + countEn + '   :   ' + 'Expire ; ' +countExpEn}</p>
            <p>{suggestion}</p>
        </article>*/

/*<BarChart
        xAxis={[
          {
            id: 'barCategories',
            data: ['bar A', 'bar B', 'bar C'],
            scaleType: 'band', // band scale for categorical data
          },
        ]}
        series={[
          {
            data: [2, 5, 3], // values for the bars
          },
        ]}
        width={500}
        height={300}
      />*/

      /*
      if (countEn > countExpEn*999){
            suggestion = 'as much as you want'
        } else if (countEn > countExpEn){
            suggestion = "Maybe think again"
        } else if (countEn === countExpEn){
            suggestion = "I don't think u need this as much"
        } 
    */