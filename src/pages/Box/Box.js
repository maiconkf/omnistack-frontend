import React, { Component } from 'react';
import socket from 'socket.io-client';
import api from '../../config/api';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { MdInsertDriveFile } from 'react-icons/md';
import Dropzone from 'react-dropzone';
import logo from '../../assets/logo.svg';
import './styles.css';

class Box extends Component {
  constructor(props) {
    super(props);

    this.state = {
      box: ''
    }
  }

  async componentDidMount() {
    this.subscribeToNewFiles();

    const box = this.props.match.params.id;
    const res = await api.get(`boxes/${box}`);

    this.setState({box: res.data});
  }

  subscribeToNewFiles = () => {
    const box = this.props.match.params.id;
    const io = socket('https://maiconkf.herokuapp.com/');

    io.emit('connectRoom', box);

    io.on('file', data => {
      this.setState({ box: { ...this.state.box, files: [data, ...this.state.box.files] } })
    });
  }

  handleUpload = (files) => {
    files.forEach(file => {
      const data = new FormData();

      data.append('file', file);

      api.post(`boxes/${this.state.box._id}/files`, data);
    });
  }

  render() {
    const files = this.state.box.files;
  
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="Logo" />
          <h1>{this.state.box.title}</h1>
        </header>
        <Dropzone onDropAccepted={ this.handleUpload }>
          {({ getRootProps, getInputProps }) => (
            <div className="upload" {...getRootProps()}>
              <input { ...getInputProps() } />
              <p>Arraste arquivos ou clique aqui</p>
            </div>
          )}
        </Dropzone>
        <ul>
          {
            files && files.map((file, index) => (
              <li key={index}>
                <a className="fileInfo" href={file.url}>
                  <MdInsertDriveFile size={24} color="A5CFFF" />
                  <strong>{file.title}</strong>
                </a>
                <span>há {distanceInWords(file.createdAt, new Date(), {
                  locale: pt
                })}</span>
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default Box;