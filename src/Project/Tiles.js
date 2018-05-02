import React from 'react';

import TemplateFactory from '../Templates/Factory'

export default function Tiles(props){
    let type = props.type
    if(props.value){
        const images = props.value.map((image) => {
            let i
            if(image.place){
                i = Object.assign(image, {color: props.colors[image.place]})
            }else{
                i= image
            }
            return (
                <TemplateFactory key={image.id} type={type} file={i}/>
            );
        })
        return (
            <div>{images}</div>
        )
    }else{
        return null
    }

}
