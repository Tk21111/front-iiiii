import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Chart } from 'react-google-charts';
import { selectCurrentUser } from '../../auth/authSlice';

const BuyExcerptFood = ({ i }) => {
    const username = useSelector(selectCurrentUser);

    const [note, setNote] = useState(null);
    const [set, setSet] = useState(false);

    let content = {};
    let list = [];
    let suggestion = 0;
    let amoutAll = 0;
    let amoutExpAll = 0;

    // Push count
    list.push(['Original', i?.count]);
    amoutAll = i?.count;

    for (let f = 0; f < i.countExp.length ; f++) {
        list.push(["update" + f.toString(), i?.countExp[f]]);
    }
    amoutExpAll = i?.countExp[i?.countExp?.length - 1];

    // Logic for suggestions
    if (amoutAll > amoutExpAll * 999) {
        suggestion = 'as much as you want';
    } else if (amoutAll > amoutExpAll) {
        suggestion = "Maybe think again";
    } else if (amoutAll === amoutExpAll) {
        suggestion = "I don't think u need this as much";
    }

    // Prepare data for the chart
    const data = [
        ["name", "amount"],
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
                    colors: ['blue', ...Array(list.length - 1).fill('red')]
                }}
            />
            <article className="centeredContainer">
                <p style={{ textAlign: 'start' }}>{"ที่ซื้อ" + ":" + "ที่เหลือ"}</p>
                <p style={{ textAlign: 'center', fontWeight: 'bold' }}>{amoutAll + ":" + amoutExpAll}</p>
            </article>
            <article className="centeredContainer">
                <p style={{ textAlign: 'start', marginBottom: "10%" }}>{"คำแนะนำ"}</p>
                <p>{suggestion}</p>
            </article>
        </article>
    );
};

export default BuyExcerptFood;
