import React, { Component } from 'react';
import './Table.css'

class Table  extends Component{
  render(){
        console.log(this.props.data);
        if(this.props.data.length > 0 ){
          return(
              <table className="edl-table" id="fixor-table">
                <thead>
                <tr>
                  <th>id</th>
                  <th>image</th>
                  <th>description</th>
                  <th>duration</th>
                  <th>name</th>
                  <th>source</th>
                </tr>
                </thead>
                <tbody>
                {
                  this.props.data.map((line) => {
                    return (
                      <tr key={line.id}>
                        <td>{line.id}</td>
                        <td><img alt="vfx" src={line.image}/></td>
                        <td>{line.description}</td>
                        <td>{line.sourceDuration(this.props.imagePerSeconde)}</td>
                        <td>{line.vfxName}</td>
                        <td>{line.fileName}</td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </table>
          )
        }else{
          return  (
              <p>No Data</p>
          )
        }
  }
}

export default Table
