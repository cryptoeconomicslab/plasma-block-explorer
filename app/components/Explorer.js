import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  Link
} from 'react-router-dom';

import { 
  Button, 
  Header,
  Input,
  Label,
  Divider,
  Container,
  List,
  Table,
  Grid,
  Segment
} from 'semantic-ui-react';

import {
  sync,
} from '../actions';
import Styles from './style.css';

class Explorer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBlkNum: null
    };
  }

  async componentDidMount() {
    await this.props.blockExplorer.init(async () => {
      await this.props.blockExplorer.sync()
      this.forceUpdate()
    })    
  }

  select(blkNum) {
    this.setState({
      selectedBlkNum: blkNum
    })
  }

  renderDepositBlock(block) {
    return (
      <Table celled fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Depositor</Table.HeaderCell>
            <Table.HeaderCell>amount</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{block.depositTx.depositor}</Table.Cell>
            <Table.Cell>{block.depositTx.segment.getAmount().toNumber()}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )
  }
  renderTxList(block) {
    if(block.isDepositBlock) {
      return this.renderDepositBlock(block)
    }
    return (
      <div>
      <div>Block Hash: {block.superRoot}</div>
      <Table celled fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>from</Table.HeaderCell>
            <Table.HeaderCell>to</Table.HeaderCell>
            <Table.HeaderCell>value</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {block.txs.map((signedTx, i) => {
              const tx = signedTx.getRawTx()
              return (
                <Table.Row key={i}>
                  <Table.Cell>{tx.label.toNumber()}</Table.Cell>
                  <Table.Cell>{tx.from}</Table.Cell>
                  <Table.Cell>{tx.to}</Table.Cell>
                  <Table.Cell>{tx.getOutput(0).getSegment(0).getAmount().toNumber()}</Table.Cell>
                </Table.Row>
              )
            })}
        </Table.Body>
      </Table>
      </div>
    )
  }

  render() {
    const { selectedBlkNum } = this.state;
    return (
        <Container>   
          <List>
            <List.Item className={Styles['content-horizontal']}>
              <List.Content>
                <Header as='h2'>Blocks</Header>
              </List.Content>
            </List.Item>
          </List>
          <Segment>
            <Grid>
              <Grid.Column width={4}>
                <Table celled>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>block number</Table.HeaderCell>
                      <Table.HeaderCell>transactions</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {
                      this.props.blockExplorer.getBlocks().map((block, i) => {
                        return (
                          <Table.Row key={i} className={Styles['table-item']} onClick={this.select.bind(this, block.number)}>
                            <Table.Cell>{block.number}</Table.Cell>
                            <Table.Cell>{block.txs.length}</Table.Cell>
                          </Table.Row>
                        );
                      })
                    }
                  </Table.Body>
                </Table>
              </Grid.Column>
              <Grid.Column width={12}>
                    {
                      selectedBlkNum ? this.renderTxList(this.props.blockExplorer.getBlock(selectedBlkNum)) : null
                    }
              </Grid.Column>
            </Grid>
          </Segment>
        </Container>
    );
  }
}

const mapDispatchToProps = {
  sync
};

const mapStateToProps = (state) => ({
  blockExplorer: state.blockExplorer
});

export default connect(mapStateToProps, mapDispatchToProps)(Explorer);
