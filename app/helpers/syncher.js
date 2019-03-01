import {
  PlasmaClient
} from '@layer2/wallet';
import {
  JsonRpcClient
} from './jsonrpc'

export class BlockExplorer {

  constructor(client) {
    this.client = client
    this.loaded = 2
    this.blocks = []
  }

  async init(handler) {
    await this.sync()
    setTimeout(async () => {
      await this.sync()
      await this.init()
      handler()
    }, 200000)
    handler()
  }

  async sync() {
    await this.loadBlocks(this.loaded, true, 50)
  }

  async loadBlocks(blkNum, isPrevExists, limit) {
    if(limit <= 0) return
    const result = await this.client.getBlock(blkNum)
    if(result.isOk()) {
      const block = result.ok()
      this.blocks[block.number] = block
      this.loaded = block.number
      await this.loadBlocks(blkNum + 1, true, limit - 1)
    } else if(isPrevExists) {
      await this.loadBlocks(blkNum + 1, false, limit - 1)
    }
  }

  getBlock(blkNum) {
    return this.blocks[blkNum]
  }

  getBlocks() {
    return this.blocks
  }

}

export default class SyncherFactory {

  static create() {
    const jsonRpcClient = new JsonRpcClient(process.env.CHILDCHAIN_ENDPOINT || 'http://localhost:3000')
    const client = new PlasmaClient(jsonRpcClient)
    return new BlockExplorer(client)
  }

}
