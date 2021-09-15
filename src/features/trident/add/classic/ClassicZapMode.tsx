import Alert from '../../../../components/Alert'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import Typography from '../../../../components/Typography'
import AssetInput from '../../../../components/AssetInput'
import TransactionDetails from './../TransactionDetails'
import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useActiveWeb3React, useBentoBoxContract } from '../../../../hooks'
import { useCurrencyBalance } from '../../../../state/wallet/hooks'
import { attemptingTxnAtom, noLiquiditySelector, poolAtom, showReviewAtom } from '../../context/atoms'
import { ConstantProductPoolState } from '../../../../hooks/useTridentClassicPools'
import ListPanel from '../../../../components/ListPanel'
import TridentApproveGate from '../../ApproveButton'
import Button from '../../../../components/Button'
import loadingCircle from '../../../../animation/loading-circle.json'
import Lottie from 'lottie-react'
import Dots from '../../../../components/Dots'
import { NATIVE } from '@sushiswap/sdk'
import { useZapAssetInput } from '../../context/hooks/useZapAssetInput'

const ClassicZapMode = () => {
  const { account, chainId } = useActiveWeb3React()
  const { i18n } = useLingui()
  const bentoBox = useBentoBoxContract()

  const [poolState, pool] = useRecoilValue(poolAtom)
  const {
    zapInputAmount: [zapInputAmount, setZapInputAmount],
    parsedAmount,
    zapCurrency: [zapCurrency, setZapCurrency],
    parsedSplitAmounts,
  } = useZapAssetInput()
  const balance = useCurrencyBalance(account ?? undefined, zapCurrency)
  const setShowReview = useSetRecoilState(showReviewAtom)
  const noLiquidity = useRecoilValue(noLiquiditySelector)
  const attemptingTxn = useRecoilValue(attemptingTxnAtom)

  let error = !account
    ? i18n._(t`Connect Wallet`)
    : poolState === ConstantProductPoolState.INVALID
    ? i18n._(t`Invalid pair`)
    : !zapInputAmount
    ? i18n._(t`Enter an amount`)
    : parsedAmount && balance?.lessThan(parsedAmount)
    ? i18n._(t`Insufficient ${parsedAmount?.currency.symbol} balance`)
    : ''

  return (
    <>
      {noLiquidity ? (
        <div className="px-5 pt-5">
          <Alert
            dismissable={false}
            type="error"
            showIcon
            message={i18n._(t`Zap mode is unavailable when there is no liquidity in the pool`)}
          />
        </div>
      ) : (
        <div className="px-5 pt-5">
          <Alert
            dismissable={false}
            type="information"
            showIcon
            message={i18n._(t`In Zap mode, your selected asset will be split and rebalanced into the corresponding tokens and their weights
          automatically.`)}
          />
        </div>
      )}

      <div className="flex flex-col gap-3 px-5">
        <AssetInput
          value={zapInputAmount}
          currency={zapCurrency}
          onChange={setZapInputAmount}
          onSelect={setZapCurrency}
          disabled={noLiquidity}
          currencies={[NATIVE[chainId], pool?.token0, pool?.token1]}
        />
        <div className="flex flex-col gap-3">
          <TridentApproveGate inputAmounts={[parsedAmount]} tokenApproveOn={bentoBox?.address}>
            {({ loading, approved }) => (
              <Button
                {...(loading && {
                  startIcon: (
                    <div className="w-5 h-5 mr-1">
                      <Lottie animationData={loadingCircle} autoplay loop />
                    </div>
                  ),
                })}
                color={zapInputAmount ? 'gradient' : 'gray'}
                disabled={!!error || !approved || attemptingTxn}
                className="font-bold text-sm"
                onClick={() => setShowReview(true)}
              >
                {attemptingTxn ? <Dots>Depositing</Dots> : loading ? '' : !error ? i18n._(t`Confirm Deposit`) : error}
              </Button>
            )}
          </TridentApproveGate>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-5 mt-8">
        <Typography weight={700} className="text-high-emphesis">
          {zapCurrency
            ? i18n._(t`Your ${zapCurrency.symbol} will be split into:`)
            : i18n._(t`Your selected token will be split into:`)}
        </Typography>
        <ListPanel
          items={parsedSplitAmounts.map((amount, index) => (
            <ListPanel.CurrencyAmountItem amount={amount} key={index} />
          ))}
        />
      </div>
      {!error && (
        <div className="mt-6 px-5">
          <TransactionDetails />
        </div>
      )}
    </>
  )
}

export default ClassicZapMode
