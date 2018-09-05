import React, { Component } from 'react';
import './Form.css'


class Form extends Component{
    render(){
        if(this.props.data !== undefined){
        const {sequence, action, periode, fx, url, color, colorDistribution} = this.props.data
        return (

            <div className={"modal" + (this.props.data ? " display" : "")}>
            <form id="form" className={"modal-content group "}>
                <input id="form-id" type="hidden" name="id" value={sequence}/>
                <img id="form-img" src={url}/>
                <input id="form-sequence" name="sequence" data-i18n-attr="placeholder:form_sequence_placeholder"  value={sequence}/>
                <label htmlFor='periode' data-i18n="form_periode_label">P</label>
                <select id="periode" name="periode">
                    <option value="" data-i18n="form_periode_null"></option>
                    <option value="m" data-i18n="form_periode_morning"></option>
                    <option value="s" data-i18n="form_periode_evening"></option>
                    <option value="j" data-i18n="form_periode_day"></option>
                    <option value="n" data-i18n="form_periode_night"></option>
                </select>
                <label htmlFor='fx' data-i18n="form_checkbox_fx">Fx</label>
                <input id="fx" name="fx" type="checkbox"  checked={fx} />
                <div>
                    <label htmlFor="place" data-i18n="form_place_label">P</label>
                    <input id="place" name="place" data-i18n-attr="placeholder:form_place_new" />
                    <span data-i18n="form_place_or"></span>
                    <select id="placeList" name="placeList"></select>
                </div>
                <textarea id="form-action" name="action" data-i18n-attr="placeholder:form_action_placeholder" rows="4"></textarea>
                <button type="submit" className="md-button" data-i18n="form_button_apply">V</button>
                <button type="button" className="md-button" id="form-close" data-i18n="form_button_close">F</button>
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
