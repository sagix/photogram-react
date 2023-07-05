import React, { Component } from 'react';
import ReactGA from 'react-ga';
import Image from '../FilesParser/Images';
import Toolbar from './Toolbar'
import Configuration from './Configuration'
import Tiles from './Tiles'
import Form from './Form'
import '../styles.css'
import './Page.css'

class Page extends Component {
  constructor(props) {
    super(props);
    this.application = props.application
    this.state = {
      project: {},
      template: "small",
      permission: false,
    };
  }

  componentDidMount() {
    this.loadData()
  }

  async loadData() {
    if (await this.application.needsPermission(this.props.id)) {
      this.setState(Object.assign(this.state, { permission: true }))
    } else {
      this.application.get(this.props.id)
        .then((project) => {
          if (project.template === undefined) {
            project.template = "small"
          }
          if (project.colorDistribution === undefined) {
            project.colorDistribution = "indicator"
          }
          this.setState(Object.assign(this.state, { project: project, permission: false }))
        }).catch(e => {
          console.error(e);
        })
    }
  }

  back() {
    ReactGA.event({
      category: 'Project',
      action: 'back'
    });
    this.props.onBack();
  }

  print() {
    let projectSize = this.state.project.data.length;
    ReactGA.event({
      category: 'Project',
      action: 'print',
      value: projectSize
    });
    window.print();
  }

  render() {
    return (
      <div>
        <Form
          data={this.state.data}
          colors={this.state.project.colors}
          onCancel={() => this.setState(Object.assign(this.state, { data: undefined }))}
          onSave={data => this.application.update(this.props.id, data).then(() => this.loadData())}
          onNewImage={file => {
            Image.create().execute(this.props.id, file).then((result) => {
              this.setState(Object.assign(this.state,
                Object.assign(this.state.data, { url: result[0].url }))
              )
            })
          }}
          onDeleteImage={() => {
            this.setState(Object.assign(this.state,
              Object.assign(this.state.data, { url: null }))
            )
          }
          }
          setAsMain={url => {
            this.application.updateMainPicture(this.props.id, url)
            this.setState(Object.assign(this.state, { data: undefined }))
          }}
        />
        <div className="layout-parent">
          <div className="layout-top">
            <Toolbar
              title={this.state.project.name}
              onPrint={() => this.print()}
              onBack={() => this.back()} />
          </div>
          <div className="layout-left">
            {
              this.state.permission
                ? (<PromtPermission promptPermission={async () => {
                  try {
                    await this.application.requestPermission(this.props.id);
                    this.loadData();
                  } catch (error) {
                    console.error(error);
                  }
                }} />)
                : (<Tiles
                  colorDistribution={this.state.project.colorDistribution}
                  defaultColor={this.state.project.defaultColor}
                  colors={this.state.project.colors}
                  value={this.state.project.data}
                  type={this.state.project.template}
                  fontFamily={this.state.project.fontFamily}
                  printSpaceAround={this.state.project.printSpaceAround}
                  onTile={data => this.setState(Object.assign(this.state, { data: data }))} />)
            }

          </div>
          <div className="layout-right">
            <Configuration
              defaultColor={this.state.project.defaultColor}
              colors={this.state.project.colors}
              template={this.state.project.template}
              fontFamily={this.state.project.fontFamily}
              printSpaceAround={this.state.project.printSpaceAround}
              onChange={template => this.application.updateTemplate(this.props.id, template).then(() => this.loadData())}
              onDefaultColorChange={color => this.application.updateDefaultColor(this.props.id, color).then(() => this.loadData())}
              onColorChange={color => this.application.updateColor(this.props.id, color).then(() => this.loadData())}
              onDeleteColor={key => this.application.deleteColor(this.props.id, key).then(() => this.loadData())}
              onColorDistributionChange={distribution => this.application.updateColorDistribution(this.props.id, distribution).then(() => this.loadData())}
              onFontFamilyChange={fontFamily => this.application.updateFontFamily(this.props.id, fontFamily).then(() => this.loadData())}
              onPrintSpaceAroundChange={printSpaceAround => this.application.updatePrintSpaceAround(this.props.id, printSpaceAround).then(() => this.loadData())}
            />
          </div>
        </div>
      </div>
    )
  }
}

function PromtPermission(props) {
  return (
    <div className='prompt-permission'>
      <img className='prompt-permission-img' src="/illus/undraw_secure_files_re_6vdh.svg" alt="" />
      <p className='prompt-permission-description'>Permission needs to be given again to access to the files.</p>
      <p className='prompt-permission-reason'>Permission will be asked after each reload</p>
      <button className='prompt-permission-button' onClick={() => { props.promptPermission() }} >Grant permission</button>
    </div>
  );
}

export default Page;
