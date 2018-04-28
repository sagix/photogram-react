import React, { Component } from 'react';

import TemplateFactory from '../templates/TemplateFactory'

export default function Tiles(props){
    console.log(props);
    let type = props.type
    if(props.value){
        const images = props.value.map((image) => {
            return (
                <TemplateFactory key={image} type={type} file={image}/>
            );
        })
        return (
            <div>{images}</div>
        )
    }else{
        return null
    }

}
