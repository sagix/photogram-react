import React, { useEffect, useState } from 'react';
import compare from '../compare';
import Table from '../Table';
import CompareTable from '../CompareTable';
import GoogleApi from '../GoogleApi'
import ImportButton from '../ImportButton'
import ExportButton from '../ExportButton'
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
	const onCopy = () => {
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
			<header className="header-container">
				<a className="header-text" href="/fixor">
					<h1 className="App-title">Fixor</h1>
					<p>A tool for assistant editor</p>
				</a>
				<ImportButton onFiles={props.onFiles}>Add another project</ImportButton>
				<form>
					<input type="number"
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
					<br />
					<label htmlFor='source'>Source: </label>
					<select name="source" id="source" value={source} onChange={onSource}>
						<option value="fileName">File name</option>
						<option value="reelName">Reel name</option>
					</select>
				</form>
				<button onClick={onCopy}>Copy</button>
			</header>
			<GoogleApi
				apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
				clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
				discoveryDocs={["https://sheets.googleapis.com/$discovery/rest?version=v4"]}
				scope="https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file">
				<ExportButton data={edl.data} imagePerSeconde={imagePerSeconde} />
			</GoogleApi>
			<form>
				<select onChange={event => setSelected(event.target.value)} value={edl.name}>
					{props.edls.map((e) =>
						(<option key={e.name} value={e.name}>{e.name}</option>)
					)}
				</select>
				<span>Compare with: </span>
				<select onChange={event => setCompareValue(event.target.value)} value={compareValue} disabled={props.edls.length <= 1}>
					<option key={""} value={""}>-- Select another edl --</option>
					{props.edls.filter((e) => e.name !== edl.name).map((e) =>
						(<option key={e.name} value={e.name}>{e.name}</option>)
					)}
				</select>
			</form>
			{content}
		</div>
	);
}

export default Edls;
