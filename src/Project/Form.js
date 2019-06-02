import React, { Component } from 'react';
import './Form.css'


class Form extends Component{
    state = {}

 componentDidMount(){
   document.addEventListener("keydown", this.escFunction, false);
 }
 componentWillUnmount(){
   document.removeEventListener("keydown", this.escFunction, false);
 }

 escFunction = (event) =>{
   if(event.keyCode === 27) {
     this.close(event)
   }
 }

      handleSubmit = (event) => {
        event.preventDefault();
        this.props.onSave(this.mergePropsWithState())
        this.close()
    }

      handleInputChange = (event) => {
       const target = event.target;
       const value = target.type === 'checkbox' ? target.checked : target.value;
       const name = target.name;
       let data = this.state.data ===  undefined ? {} : this.state.data
       this.setState(state => {
           return {
               data : Object.assign(
                   data,
                   {[name]: value}
               )
           }
     });

     }

     clearPlace = (event) => {
         event.preventDefault();
         let data = this.state.data ===  undefined ? {} : this.state.data
      this.setState(state => {
          return {
              data : Object.assign(
                  data,
                  {["place"]: ""}
              )
          }
    });

    }

    close = (event) => {
        this.setState({data: undefined}, () => console.log(this.state))
        this.props.onCancel()
    }

   handleClose = (event) => {
       event.preventDefault()
       this.close()
   }

    mergePropsWithState(){
        const fromState  = this.state.data === undefined ? {} : this.state.data
        const fromProps  = this.props.data === undefined ? {} : this.props.data
        return Object.assign({}, fromProps, fromState)
    }

    render(){
        if(this.props.data !== undefined){

        const {sequence, action, periode, place, fx, url} = this.mergePropsWithState()
        const places = Object.keys(this.props.colors === undefined ? {} : this.props.colors).sort()
        return (

            <div className={"modal" + (this.props.data ? " display" : "")}>
            <form id="form" className={"modal-content group "} onSubmit={this.handleSubmit}>
                <input id="form-id" type="hidden" name="id" defaultValue={sequence} onChange={this.handleInputChange}/>
                <img id="form-img" src={url} alt="Photogram"/>
                <input id="form-sequence" name="sequence" placeholder="sequence" defaultValue={sequence} onChange={this.handleInputChange}/>
                <label htmlFor='periode'>Periode</label>
                <select id="periode" name="periode" defaultValue={periode} onChange={this.handleInputChange}>
                    <option value="">None</option>
                    <option value="matin">Morning</option>
                    <option value="soir">Evening</option>
                    <option value="jour">Day</option>
                    <option value="nuit">Night</option>
                </select>
                <label htmlFor='fx'>Fx</label>
                <input id="fx" name="fx" type="checkbox" checked={fx} onChange={this.handleInputChange}/>
                <div>
                    <label htmlFor="place">Place</label>
                    <input id="place" list="country-list" name="place" placeholder="Place" value={place} onChange={this.handleInputChange} />
                    <datalist id="country-list">
                        {places.map(p =>
                            <option key={p} value={p}/>
                        )}
                    </datalist>
                    <button onClick={this.clearPlace}>&#x2573;</button>
                </div>
                <textarea id="form-action" name="action" placeholder="action" rows="4" onChange={this.handleInputChange} value={action}></textarea>
                <button type="submit" className="md-button">Save</button>
                <button type="button" className="md-button" id="form-close" onClick={this.handleClose}>Close</button>
            </form>
            </div>
        )
    }else{
        return (
            <div className={"modal"}/>
        )
    }
    }
}

export default Form;
