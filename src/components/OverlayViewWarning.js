import React, { useState } from "react";
import ReactDom from 'react-dom';
import { Link, useNavigate } from "react-router-dom";

import ConfirmSelection from "./ConfirmSelection";

export default function OverayCenterView({ imgPath , dataFood, open, onClose ,donate , select ,name , post}) {
    const [confirm , setConfirm] = useState(false);

    const navigate = useNavigate()

    if (!open) {
        return null;
    }

        return ReactDom.createPortal(
            <>
                <div style={{
                    zIndex: 999
                }} className="over-ray">
                    <p>This is just a demo</p> 
                    <p>นี่คือ ตัวทดลอง ไม่สามารถบริจาคให้ได้จริง หากต้องการ</p>
                    <link a={"https://cloudfoodbank.org/"}>Cloudfoodbank</link>
                </div>
            </>,
            document.getElementById('portal')
        );
    
    
};
