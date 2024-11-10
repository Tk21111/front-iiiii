import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllNoteUserMutation } from "../NoteApiSlice";
import { selectCurrentUser } from '../../auth/authSlice';
import { useSelector } from 'react-redux';

import Chart from 'react-google-charts';

const BuyExcerpt = ({ i }) => {
    const username = useSelector(selectCurrentUser);

    const [getAllNoteUser] = useGetAllNoteUserMutation();

    //obj key = _id 
    const [note, setNote] = useState(null);
    const [set , setSet] =useState(false);

    useEffect (()=> {
        if(!note){
            setNote(i);
            setSet(true)
        }
    }, [i,note])

    //key with tag
    let key = note ? Object.keys(note) : 0;

    let tag;
    if (Array.isArray(key)){
        tag = note.tag
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
                let entities = note[f]
                const TmpExp = entities?.countExp
                for (i = 0 ; i <= entities?.countExp?.length -1 ; i++){
                    list.push([entities?.text + "(" + i + ")" , entities?.count , entities?.countExp[i]]);
                }
                amoutAll += entities?.count;
                amoutExpAll += entities?.countExp?.reduce((x,y) => {return x+y});
            } catch (err){
                console.log(err)
            }
            
        }


    

    //obj {key : count , countExp}
    

        //setCount(countEn)
        //setCountExp(countExpEn)

        //logic something
        
    } 

    if (!note) {
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
                options={{isStacked: true}}
                
            />
            <article className='centeredContainer'>
                <p style={{textAlign: 'start'}}>{"ที่ซื้อ" + ":" + "ที่เหลือ" }</p>
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