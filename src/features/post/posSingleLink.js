import React from 'react'

const posSingleLink = ({i}) => {
    
    const imagePath = i?.images.map(image => `${process.env.REACT_APP_API}/${image.replace(/\\/g, '/')}`);

  return (
    <div className='single-parent'>
        {imagePath.map(val => <img className='post-single-img'src={val} alt='pic'/>)}
        <h2>{i.text}</h2>
    </div>
  )
}

export default posSingleLink