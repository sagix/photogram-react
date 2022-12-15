import React from 'react';
import './Table.css'

function EmptyTable() {
  return (
    <p>No Data</p>
  );
}

function DataTable(props) {
  return (
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
          props.data.map((line) => {
            return (
              <tr key={line.key}>
                <td>{line.id}</td>
                <td><img alt="vfx" src={line.image} /></td>
                <td>{line.description}</td>
                <td>{line.sourceDuration(props.imagePerSeconde).toString()}</td>
                <td>{line.vfxName}</td>
                <td>{line[props.source]}</td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  );
}

function Table(props) {
  if (props.data.length > 0) {
    return DataTable(props)
  } else {
    return EmptyTable()
  }
}

export default Table
