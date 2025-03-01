import { Interface } from '@ethersproject/abi'
import IUniswapV2PairABI from '@sushiswap/core/abi/IUniswapV2Pair.json'
import { Currency, CurrencyAmount, Pair as BasePair } from '@sushiswap/core-sdk'
import { FACTORY_ADDRESS } from 'app/constants/extension'
import { computePairAddress } from 'app/constants/extension/functions/computePairAddress'
import { Pair } from 'app/entities/extension/Pair'
import { useMultipleContractSingleData } from 'app/lib/hooks/multicall'
import { useMemo } from 'react'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function useV2Pairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, BasePair | null][] {
  const tokens = useMemo(
    () => currencies.map(([currencyA, currencyB]) => [currencyA?.wrapped, currencyB?.wrapped]),
    [currencies]
  )

  const pairAddresses = useMemo(
    () =>
      tokens.reduce<(string | undefined)[]>((acc, [tokenA, tokenB]) => {
        const address =
          tokenA &&
          tokenB &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          FACTORY_ADDRESS[tokenA.chainId]
            ? computePairAddress({
                factoryAddress: FACTORY_ADDRESS[tokenA.chainId],
                tokenA,
                tokenB,
              })
            : undefined

        acc.push(address && !acc.includes(address) ? address : undefined)
        return acc
      }, []),
    [tokens]
  )

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]
      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new BasePair(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString())
        ),
      ]
    })
  }, [results, tokens])
}

export function useV2PairsWithPairMap(
  currencies: [Currency | undefined, Currency | undefined][],
  pairMap: { [key: string]: string }
): [PairState, Pair | null][] {
  const tokens = useMemo(
    () => currencies.map(([currencyA, currencyB]) => [currencyA?.wrapped, currencyB?.wrapped]),
    [currencies]
  )

  const pairAddresses = useMemo(
    () =>
      tokens.reduce<(string | undefined)[]>((acc, [tokenA, tokenB]) => {
        const address =
          tokenA &&
          tokenB &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          pairMap[`${tokenA.address}-${tokenB.address}`]

        acc.push(address && !acc.includes(address) ? address : undefined)
        return acc
      }, []),
    [pairMap, tokens]
  )

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]
      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
          pairMap
        ),
      ]
    })
  }, [pairMap, results, tokens])
}

export function useV2Pair(tokenA?: Currency, tokenB?: Currency): [PairState, BasePair | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return useV2Pairs(inputs)[0]
}

export function useV2PairWithPairMap(
  pairMap: { [key: string]: string },
  tokenA?: Currency,
  tokenB?: Currency
): [PairState, Pair | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return useV2PairsWithPairMap(inputs, pairMap)[0]
}
