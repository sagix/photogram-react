import React from 'react';

import TemplateFactory from '../Templates/Factory'
import './Tiles.css'

export default function Tiles(props) {
    let type = props.type
    if (props.value) {
        const images = props.value.map((image) => {
            let i
            if (image.label) {
                i = Object.assign(image, {
                    color: props.colors[image.label],
                    colorDistribution: props.colorDistribution
                })
            } else {
                i = Object.assign(image, {
                    color: undefined,
                    colorDistribution: props.colorDistribution
                })
            }
            return (
                <TemplateFactory key={image.id} type={type} file={i} onTile={data => props.onTile(Object.assign({}, data))} />
            );
        })
        return (
            <div className="tiles-container" style={{ fontFamily: props.fontFamily }}>{images}</div>
        )
    } else {
        return null
    }

}
