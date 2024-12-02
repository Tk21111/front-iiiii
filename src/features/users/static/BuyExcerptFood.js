import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Chart } from 'react-google-charts';
import { selectCurrentUser } from '../../auth/authSlice';
import { translate } from '../../../hooks/translator';

const BuyExcerptFood = ({ i }) => {
    const username = useSelector(selectCurrentUser);

    const [note, setNote] = useState(null);
    const [set, setSet] = useState(false);

    let content = {};
    let list = [];
    let suggestion = 0;
    let amount = [];
   
    let suggestionProcess = []

    // Push count
    list.push(['Original', i?.count[0],i?.countExp[0]]);
    

    for (let f = 1; f < i.countExp.length ; f++) {
        //2 : 1 
        if ((i?.count[f] || 0) - (i?.countExp[f] || 0) / 2 >= 1) {suggestionProcess++}
        list.push(["update" + f.toString(), i?.count[f] , i?.countExp[f]]);
    }


    amount[0] = ["ที่ซื้อ " , i?.count.reduce((prev , curr)=>{
        return curr > prev ? curr : prev
    }) || 0];
    amount[1] =[  i?.count[0] - i?.count[i?.count?.length - 1] >= 0? "ที่ใช้" : "ที่เพิ่ม" , Math.abs(i?.count[0] - i?.count[i?.count?.length - 1]) || 0];
    amount[2] = ["ที่หมดอายุ" , i?.countExp[i?.countExp?.length - 1] || 0 ];

    // Logic for suggestions
    if (suggestionProcess/(list.length -1 ) === 1  ) {
        if(amount[1][1] / amount[2][1] > 5){
            suggestion = translate("t1");
        }
        else {
            suggestion = translate("t2")
        }
        
    } else if (suggestionProcess/(list.length -1) >0.5) {
        if(amount[1][1] / amount[2][1] > 2){
            suggestion = translate("t3");
        } else {
            suggestion = translate("t4");
        }
        
    } else{
        suggestion = translate("t5");
    }

    // Prepare data for the chart
    const data = [
        ["name", "amountHave" , 'amountExp'],
        ...list
    ];

    return (
        <article style={{ justifyContent: 'center', textAlign: 'center' }}>
            <h2>{i.text}</h2>
            <Chart
                chartType="Bar"
                data={data}
                width="100%"
                height="400px"
                options={{
                    legend: { position: 'none' },
                    colors: ['blue' , 'red']
                }}
            />
            <div className="centeredContainer" style={{flexDirection: 'row' , display: 'flex' , justifySelf: 'center'}}>
                {amount.map(val => {
                    return (
                        <div style={{border : 'black solid 1px' , width: '25vi'}}>
                            <p style={{ textAlign: 'center' }}>{val[0]}</p>
                            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>{val[1]}</p>
                        </div>
                    )
                    
                })}
                
            </div>
            <article className="centeredContainer">
                <p style={{ textAlign: 'start', marginBottom: "10%" }}>{"คำแนะนำ"}</p>
                <p>{suggestion}</p>
            </article>
        </article>
    );
};

export default BuyExcerptFood;
