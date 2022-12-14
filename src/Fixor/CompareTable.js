import React, { Component } from 'react';
import './CompareTable.css'

class CompareTable extends Component {

  render() {
    if (this.props.data.length > 0) {
      return (
        <table className="edl-compare-table" id="fixor-table">
          <thead>
            <tr>
              <th>status</th>
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
              this.props.data.map((diffLine) => {
                let line;
                if (diffLine.lineB !== undefined) {
                  line = diffLine.lineB;
                } else {
                  line = diffLine.lineA;
                }
                if (diffLine.type === "modify") {
                  return (<HistoryLine
                    key={diffLine.type + line.key}
                    diffLine={diffLine}
                    imagePerSeconde={this.props.imagePerSeconde}
                    source={this.props.source}
                  />)
                } else {
                  return (<OneLine
                    key={diffLine.type + line.key}
                    diffLine={diffLine}
                    imagePerSeconde={this.props.imagePerSeconde}
                    source={this.props.source}
                  />)
                }

              })
            }
          </tbody>
        </table>
      )
    } else {
      return (
        <p>No Data</p>
      )
    }
  }
}

class OneLine extends Component {

  render() {
    let line;
    if (this.props.diffLine.lineB !== undefined) {
      line = this.props.diffLine.lineB;
    } else {
      line = this.props.diffLine.lineA;
    }

    console.log(this.props.diffLine.type + line.key)
    return (
      <tr>
        <td title={this.props.diffLine.changes}>{this.props.diffLine.type}</td>
        <td>{line.id}</td>
        <td><img alt="vfx" src={line.image} /></td>
        <td>{line.description}</td>
        <td>{line.sourceDuration(this.props.imagePerSeconde)}</td>
        <td>{line.vfxName}</td>
        <td>{line[this.props.source]}</td>
      </tr>
    )

  }
}

class HistoryLine extends Component {

  constructor(props) {
    super(props)
    this.onHistory = this.onHistory.bind(this)
    this.state = {
      history: false
    }
  }

  onHistory() {
    this.setState(Object.assign(this.state, { history: !this.state.history }));
  }

  render() {
    let lineA = this.props.diffLine.lineA;
    let lineB = this.props.diffLine.lineB;

    return (
      <tr className={this.state.history ? "with-history" : "without-history"}>
        <td title={this.props.diffLine.changes}><button onClick={this.onHistory}>{this.props.diffLine.type}</button></td>
        <td><del>{lineA.id}</del>{lineB.id}</td>
        <td><img alt="vfx" src={lineB.image} /></td>
        <td><del>{lineA.description}</del>{lineB.description}</td>
        <td><del>{lineA.sourceDuration(this.props.imagePerSeconde)}</del>{lineB.sourceDuration(this.props.imagePerSeconde)}</td>
        <td><del>{lineA.vfxName}</del>{lineB.vfxName}</td>
        <td><del>{lineA[this.props.source]}</del>{lineB[this.props.source]}</td>
      </tr>
    )

  }
}

export default CompareTable
