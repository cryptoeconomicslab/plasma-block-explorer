import React, { Component } from 'react';
import { connect } from 'react-redux';

import { 
  Header,
  Loader,
  Container,
} from 'semantic-ui-react';

import {
  web3connect
} from './../actions';
import Styles from './style.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    // initialize web3
    window.addEventListener('load', async () => {
      await this.props.web3connect();
    });
  }

  render() {
    const { account } = this.state;

    if (!this.props.blockExplorer) {
      return (
        <Loader active>Loading</Loader>
      );
    }
    
    return (
      <div>
        <div className={Styles['header-top']} >
          <Container>
            <Header as='h1'>Plasma Block Explorer</Header>
          </Container>
        </div>
        {this.props.children}
      </div>
    );
  }
}

const mapDispatchToProps = {
  web3connect
};

const mapStateToProps = (state) => ({
  blockExplorer: state.blockExplorer
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
