import { Token } from '@sushiswap/core-sdk'
import { ChainId, WNATIVE_ADDRESS } from 'app/constants/extension/index'

export const zkTestNetTokenMap = {
  USDC: '0x0faF6df7054946141266420b43783387A78d82A9',
  DAI: '0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b',
  WETH: WNATIVE_ADDRESS[ChainId.ZKSYNC_TESTNET],
}

export const zkTestNetTokens = {
  WETH9: new Token(ChainId.ZKSYNC_TESTNET, zkTestNetTokenMap.WETH, 18, 'WETH', 'Wrapped Ether'),
  USDC: new Token(ChainId.ZKSYNC_TESTNET, zkTestNetTokenMap.USDC, 6, 'USDC', 'USDC'),
  DAI: new Token(ChainId.ZKSYNC_TESTNET, zkTestNetTokenMap.DAI, 18, 'DAI', 'DAI'),
}
