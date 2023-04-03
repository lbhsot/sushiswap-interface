import { Pair } from '@sushiswap/core-sdk'
import usePairMap from 'app/hooks/usePairMap'
import { useV2PairsWithPairMap } from 'app/hooks/useV2Pairs'
import { useActiveWeb3React } from 'app/services/web3'
import { useTrackedTokenPairs } from 'app/state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from 'app/state/wallet/hooks'
import { useMemo } from 'react'

interface V2PairsWithLiquidity {
  loading: boolean
  pairs: Pair[]
}

/**
 * Fetches all of the V2 pairs the user has with a balance
 * @return V2PairsWithLiquidity
 */
export const useV2PairsWithLiquidity = (): V2PairsWithLiquidity => {
  const { account, library } = useActiveWeb3React()
  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  const { tokenPairsWithLiquidityTokens, pairMap } = usePairMap(trackedTokenPairs, library)

  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((ret) => ret.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) => {
        return v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      }),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = useV2PairsWithPairMap(
    liquidityTokensWithBalances.map(({ tokens }) => tokens),
    pairMap
  )
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  return { loading: v2IsLoading, pairs: allV2PairsWithLiquidity }
}
