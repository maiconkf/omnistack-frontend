import React, { Component } from 'react';
import api from '../../config/api';
import logo from '../../assets/logo.svg';
import './styles.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newBox: ''
    }
  }
  
  handleSubmit = async e => {
    e.preventDefault();

    const response = await api.post('boxes', {
      title: this.state.newBox
    });

    this.props.history.push(`/box/${response.data._id}`);
  }

  handleInput = (e) => {
    this.setState({ newBox: e.target.value });
  }

  render() {
    return (
      <div id="main-container">
        <form onSubmit={this.handleSubmit}>
          <img src={logo} alt="Logo" />
          <input placeholder="Criar um box" value={this.state.newBox} onChange={this.handleInput} />
          <button type="submit">Criar</button>
        </form>
      </div>
    )
  }
}

export default Home;