import React, { useEffect, useState } from 'react';
import compare from '../compare';
import Table from '../Table';
import CompareTable from '../CompareTable';
import GoogleApi from '../GoogleApi'
import ExportButton from '../ExportButton'
import logo from '../../Header/logo.svg';
import './index.css';

function Edls(props) {
	const [selected, setSelected] = useState(props.edls[0].name);
	const [compareValue, setCompareValue] = useState("");
	const [imagePerSeconde, setImagePerSeconde] = useState(NaN);
	const [source, setSource] = useState("fileName");

	useEffect(() => {
		if (props.edls.length > 0) {
			setSelected(props.edls[props.edls.length - 1].name)
		}
	}, [props.edls])

	const onImagePerSecond = (event) => {
		let value = event.target.value
		setImagePerSeconde(parseFloat(value));
	}

	const onSource = (event) => {
		let value = event.target.value
		setSource(value)
	}
	const onCopy = (event) => {
		event.preventDefault();
		selectElementContents(document.getElementById("fixor-table"), () => document.execCommand("copy"));
	}

	function selectElementContents(el, callback) {
		var range = document.createRange();
		var sel = window.getSelection();
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

	let edl = props.edls.find(edl => edl.name === selected);
	let compareTo = props.edls.find(edl => edl.name === compareValue);
	let content;
	if (compareTo !== undefined) {
		content = (<CompareTable
			data={compare(compareTo.data, edl.data)}
			imagePerSeconde={imagePerSeconde}
			source={source}
		/>)
	} else {
		content = (<Table
			data={edl.data}
			imagePerSeconde={imagePerSeconde}
			source={source}
		/>)
	}

	return (
		<div>
			<header className="fixor-tool-header">
				<a href="/fixor" className="fixor-tool-header-button" >
					<img src={logo} className="fixor-tool-header-logo" alt="logo of Photogram" />
				</a>
				<form>
					<select onChange={event => setSelected(event.target.value)} value={edl.name}>
						{props.edls.map((e) =>
							(<option key={e.name} value={e.name}>{e.name}</option>)
						)}
					</select>
					<div className='fixor-tool-actions'>
						<input type="file" id="import-button"
							className="import-button-input"
							webkitdirectory={true.toString()}
							directory={true.toString()}
							multiple={true}
							onChange={(event) => {
								props.onFiles(event.target.files)
								event.target.form.reset()
							}} />
						<span className='fixor-tool-action'><label htmlFor="import-button">Add</label></span>


						<span className='fixor-tool-action'>
							<label htmlFor="compare-button">Compare: </label>
							<select
								id="compare-button"
								onChange={event => setCompareValue(event.target.value)}
								value={compareValue}
								disabled={props.edls.length <= 1}>
								<option key={""} value={""}>-- Select another edl --</option>
								{props.edls.filter((e) => e.name !== edl.name).map((e) =>
									(<option key={e.name} value={e.name}>{e.name}</option>)
								)}
							</select>
						</span>
						<span className='fixor-tool-action'>
							<label htmlFor="compare-button">FPS: </label>
							<input type="number"
								id="fps-input"
								placeholder="FPS"
								list="imagePerSeconde"
								onChange={onImagePerSecond}
								defaultValue={imagePerSeconde.toString()} />
							<datalist id="imagePerSeconde">
								<option value="23.98" />
								<option value="24" />
								<option value="25" />
								<option value="29.97" />
							</datalist>
						</span>
						<span className='fixor-tool-action'>
							<label htmlFor='source'>Source: </label>
							<select name="source" id="source" value={source} onChange={onSource}>
								<option value="fileName">File name</option>
								<option value="reelName">Reel name</option>
							</select>
						</span>
					</div>
				</form>
				<button onClick={onCopy} className="import-button-label">Copy</button>
			</header>
			<GoogleApi
				apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
				clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
				discoveryDocs={["https://sheets.googleapis.com/$discovery/rest?version=v4"]}
				scope="https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file">
				<ExportButton data={edl.data} imagePerSeconde={imagePerSeconde} />
			</GoogleApi>
			<br/>
			{content}
		</div>
	);
}

export default Edls;
