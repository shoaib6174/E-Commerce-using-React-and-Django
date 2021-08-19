import React from 'react'

function Rating({value, text, color}) {
    const stars = []
    for ( let i = 1 ; i<6 ; i++){
        stars.push(
            <i style={{color}} className={
                value >= i
                ? 'fas fa-star'
                : value >= ( i - .5)
                ? 'fas fa-star-half-alt'
                :   'far fa-star'
            }>

            </i>
        )
    }

    return (
        <div className='rating'>
            <span>
                {
                  stars
                   
                }
            </span>
            <span>
                {text && text}
            </span>
        </div>
    )
}

export default Rating
