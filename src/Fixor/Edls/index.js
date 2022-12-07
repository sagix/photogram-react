import React, { Component } from 'react';
import compare from '../compare';
import Table from '../Table';
import CompareTable from '../CompareTable';
import GoogleApi from '../GoogleApi'
import ImportButton from '../ImportButton'
import ExportButton from '../ExportButton'
import './index.css';
class Edls extends Component{
  constructor(props){
      super(props)
      this.state ={
      	selected: props.edls[0].name,
      	compare: "",
        imagePerSeconde: NaN
      }
  }

  componentDidUpdate(prevProps) {
	  if (prevProps.edls.length !== this.props.edls.length) {
	    this.select(this.props.edls[this.props.edls.length - 1].name);
	  }
	}

  onImagePerSecond = (event) => {
  	let value = event.target.value
    this.setState(Object.assign(this.state, {
      imagePerSeconde: parseFloat(value)
    }))
  }
    copy= () => {
    this.selectElementContents(document.getElementById("fixor-table"), () => document.execCommand("copy"));
  }

  	select = (name) => {
  		this.setState(Object.assign(this.state, {
      		selected: name
    	}));
  	}

  	compare = (name) => {
  		this.setState(Object.assign(this.state, {
      		compare: name
    	}));
  	}

  	 selectElementContents(el, callback) {
    var range = document.createRange();
    var sel =  window.getSelection();
    sel.removeAllRanges();
    try {
        range.selectNodeContents(el);
        sel.addRange(range);
    } catch (e) {
        range.selectNode(el);
        sel.addRange(range);
    }
    callback()
    sel.removeAllRanges();
}

    render(){
    	let edl = this.props.edls.find(edl => edl.name === this.state.selected);
    	let compareTo = this.props.edls.find(edl => edl.name === this.state.compare);
    	let content
    	if(compareTo !== undefined){
    		content = (<CompareTable data={compare(compareTo.data, edl.data)} imagePerSeconde={this.state.imagePerSeconde}/>)
    	} else {
    		content = (<Table data={edl.data} imagePerSeconde={this.state.imagePerSeconde}/>)
    	}
    
        return (
        	<div>
        	<header className="header-container">
	            <a className="header-text" href="/fixor">
	              <h1 className="App-title">Fixor</h1>
	              <p>A tool for assistant editor</p>
	            </a>
	            <ImportButton onFiles={this.props.onFiles}>Add another project</ImportButton>
	            <form>
	                <input type="number" 
	                	placeholder="FPS"
	                	list="imagePerSeconde" 
	                	onChange={this.onImagePerSecond} 
	                	defaultValue={this.state.imagePerSeconde}/>
	                <datalist id="imagePerSeconde">
					    <option value="23.98" />
					    <option value="24" />
					    <option value="25" />
					    <option value="29.97" />
					</datalist>
	            </form>
	            <button onClick={this.copy}>Copy</button>
	          </header>
	            <GoogleApi
	              apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
	              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
	              discoveryDocs={["https://sheets.googleapis.com/$discovery/rest?version=v4"]}
	              scope="https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file">
	                <ExportButton data={edl.data}  imagePerSeconde={this.state.imagePerSeconde}/>
	            </GoogleApi>
	            <form>
		            <select onChange={event => this.select(event.target.value)} value={edl.name}>
		            	{this.props.edls.map((e) => 
		            		(<option key={e.name} value={e.name}>{e.name}</option>)
	            		)}	
		            </select>
		            <span>Compare with: </span>
		            <select onChange={event => this.compare(event.target.value)} value={this.state.compare} disabled={this.props.edls.length <= 1}>
		            	<option key={""} value={""}>-- Select another edl ---</option>
		            	{this.props.edls.filter((e) => e.name !== edl.name).map((e) => 
		            		(<option key={e.name} value={e.name}>{e.name}</option>)
	            		)}	
		            </select>
	            </form>
	            {content}
	        </div>
        )
    }
}

export default Edls;
