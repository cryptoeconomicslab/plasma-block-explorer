import SyncherFactory from '../helpers/syncher';

export const WEB3_CONNECTED = 'WEB3_CONNECTED';
export const UPDATE_UTXO = 'UPDATE_UTXO';

export function web3connect() {
  return async (dispatch) => {
    console.log("a")
    const blockExplorer = SyncherFactory.create()
    dispatch({
      type: WEB3_CONNECTED,
      payload: {
        blockExplorer: blockExplorer
      }
    });
    return blockExplorer;
  };
}

export function fetchBlock(blkNum) {
  if(typeof blkNum == 'string') {
    blkNum = Number(blkNum);
  }
  return (dispatch, getState) => {
    return childChainApi.getBlockByNumber(blkNum).then((block) => {
      const transactions = block.result.txs.map(tx => {
        return Transaction.fromBytes(new Buffer(tx, 'hex'));
      });
      dispatch({
        type: FETCH_BLOCK,
        payload: {
          txs: transactions
        }
      });
    });
  };
}

export function sync() {
  return (dispatch, getState) => {
    const plasmaSyncher = getState().plasmaSyncher;
    plasmaSyncher.sync().then(() => {
      const utxos = Object.keys(wallet.utxos).map(k => wallet.utxos[k])
      dispatch({
        type: UPDATE_UTXO,
        payload: utxos
      });
    });
  };
}
