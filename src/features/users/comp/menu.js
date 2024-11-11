
const list = {'ไก่' : ['กะเพราไก่' , 'ไก่กะเพรา' , 'มะละไก่'] , 'ปลา' : ['ปลากระพง' , 'ปลาชุบแป้งทอด' , 'กะเพราปลา'] , 'sa' : ['gh','ghj'] , "test" : ["fixbug" , "fixbug1" , "fixbug2"]}
const listNew = [
    [['ไก่' ,'ข้าว','กระเพรา'], [{name : 'กะเพราไก่', id: 'own=00'} , {name : 'ไก่กะเพรา', id: 'own=01'}]],
    [['ปลา' ,'ข้าว','กระเพรา'], [{name : 'ปลาปลา' , id: 'own=10'} , {name : 'ปลา' , id: 'own=11'}]],
    ]

const listHowMeat = [
    ['ไก่', {des : 'wow'} , ] , ['ปลา' , {des : 'ws'}]
]
const listHowVeg = [
    [ 'ผักบุ่ง', {des : 'wow'}] 
]
export {listNew , listHowMeat , listHowVeg};


