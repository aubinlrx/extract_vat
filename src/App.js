import React, { Component } from 'react';
import Promise from 'bluebird';
import superagent from 'superagent';
import superagentPromise from 'superagent-promise';
import Dropzone from 'react-dropzone';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './App.css';

const request = superagentPromise(superagent, Promise);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inError: false,
      isUploading: false,
      isUploaded: false,
      vats: [],
      inputValue: ''
    }

    this.onDrop = this.onDrop.bind(this);
    this.onUploadSuccess = this.onUploadSuccess.bind(this);
    this.onUploadError = this.onUploadError.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onDrop(acceptedFiles) {
    const pdfFile = acceptedFiles[0];

    this.setState({
      isUploaded: false,
      isUploading: true,
      inError: false,
      vats: []
    });

    request.post('http://localhost:3001/upload')
      .field('excluded_vat', this.state.inputValue)
      .attach(pdfFile.name, pdfFile)
      .then(this.onUploadSuccess)
      .catch(this.onUploadError);
  }

  onUploadSuccess(res) {
    this.setState({
      inError: false,
      isUploaded: true,
      isUploading: false,
      vats: res.body.vats || []
    });
  }

  onUploadError(err) {
    this.setState({
      isUploading: false,
      inError: true
    });
  }

  onInputChange(event) {
    this.setState({
      inputValue: event.target.value
    });
  }

  renderResult(vats, isUploaded) {
    if (!isUploaded) {
      return;
    }

    if (vats.length === 0) {
      return (
        <p>The is no valid vat in this file.</p>
      )
    }

    return (
      <ul className="list-unstyled">
      { vats.map((vat, i) => {
        return <li key={i}>Vat: {vat}</li>
      })}
      </ul>
    )
  }

  render() {

    const {
      vats,
      inError,
      isUploading,
      isUploaded
    } = this.state;

    return (
      <div className="App">
        <div className="App-header">
          <h2>PDF VAT Extractor</h2>
        </div>

        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="jumbotron p-10">
              <div className="form-group">
                <label>
                  Enter VAT number to exclude:
                </label>
                <input
                  className="form-control text-center"
                  onChange={this.onInputChange}
                  value={this.state.inputValue}
                />
              </div>

              <label>
                Drop a pdf file
              </label>
              <div className="App-dropzone">
                <Dropzone
                  onDrop={this.onDrop} />
              </div>

              { this.renderResult(vats, isUploaded) }

              {
                !inError ? null : <p>Precessing failed</p>
              }
              {
                !isUploading ? null : <p>Processing...</p>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
