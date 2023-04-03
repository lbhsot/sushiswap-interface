import { Web3Provider } from '@ethersproject/providers'
import { Token } from '@sushiswap/core-sdk'
import useTransactionStatus from 'app/hooks/useTransactionStatus'
import useBlockNumber from 'app/lib/hooks/useBlockNumber'
import { getPairToken } from 'app/state/user/hooks'
import { useEffect, useMemo, useState } from 'react'

function usePairMap(
  tokenList: [Token, Token][],
  library: Web3Provider | undefined
): {
  tokenPairsWithLiquidityTokens: { liquidityToken: Token; tokens: [Token, Token] }[]
  pairMap: { [key: string]: string }
} {
  const currentBlockNumber = useBlockNumber()
  const currentTransactionStatus = useTransactionStatus()
  const [lastBlockNumber, setLastBlockNumber] = useState<number | undefined>(undefined)
  const [lastTokens, setLastTokens] = useState<string>()

  const [tokenPairsWithLiquidityTokens, setTokenPairsWithLiquidityTokens] = useState<
    { liquidityToken: Token; tokens: [Token, Token] }[]
  >([])

  useEffect(() => {
    const fetchPairs = async () => {
      const currentTokens = tokenList.map((item) => `${item[0].address}-${item[1].address}`).join(',')
      if (
        !currentTokens ||
        currentTokens === lastTokens ||
        (currentBlockNumber && lastBlockNumber === currentBlockNumber)
      )
        return
      const pairs = await Promise.all(
        tokenList.map(async (tokens) => ({
          liquidityToken: library ? await getPairToken(tokens, library) : undefined,
          tokens,
        }))
      )
      const filteredPairs: { liquidityToken: Token; tokens: [Token, Token] }[] = []
      pairs.forEach((pair) => {
        if (pair.liquidityToken) {
          // @ts-ignore
          filteredPairs.push(pair)
        }
      })
      setTokenPairsWithLiquidityTokens(filteredPairs)
      setLastBlockNumber(currentBlockNumber)
      setLastTokens(currentTokens)
    }
    console.log('fetcing pairs -> ', 'lastBlockNumber: ', lastBlockNumber, 'currentBlockNumber: ', currentBlockNumber)
    fetchPairs()
  }, [library, tokenList, currentBlockNumber, currentTransactionStatus, lastBlockNumber, lastTokens])
  const pairMap: { [key: string]: string } = useMemo(() => {
    const map: { [key: string]: string } = {}
    tokenPairsWithLiquidityTokens.forEach((item) => {
      const liquidityToken = item.liquidityToken
      const [tokenA, tokenB] = item.tokens
      map[`${tokenA.address}-${tokenB.address}`] = liquidityToken.address
    })
    console.log('reset pairMap')
    return map
  }, [tokenPairsWithLiquidityTokens])
  return {
    tokenPairsWithLiquidityTokens,
    pairMap,
  }
}

export default usePairMap
