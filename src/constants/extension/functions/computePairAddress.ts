import { getCreate2Address } from '@ethersproject/address'
import { keccak256, pack } from '@ethersproject/solidity'
import { INIT_CODE_HASH as BASE_INIT_CODE_HASH, Token } from '@sushiswap/core-sdk'
import { ChainId } from 'app/constants/extension'

const INIT_CODE_HASH = {
  ...BASE_INIT_CODE_HASH,
  [ChainId.ZKSYNC_TESTNET]: '0xb7b5fa9474f2bbdd2519cfdc4af47891d192f755311a674eec58fa13ab384efa',
}

export const computePairAddress = ({
  factoryAddress,
  tokenA,
  tokenB,
}: {
  factoryAddress: string
  tokenA: Token
  tokenB: Token
}): string => {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks

  return getCreate2Address(
    factoryAddress,
    keccak256(['bytes'], [pack(['address', 'address'], [token0.address, token1.address])]),
    // @ts-ignore
    INIT_CODE_HASH[token0.chainId]
  )
}
