import { FC } from 'react'
import Typography from '../../../components/Typography'
import { useLingui } from '@lingui/react'
import { t } from '@lingui/macro'
import TransactionDetailsExplanationModal from './TransactionDetailsExplanationModal'
import { useRecoilValue } from 'recoil'
import { liquidityModeAtom, poolAtom, poolBalanceAtom } from '../context/atoms'
import { useDependentAssetInputs } from '../context/hooks/useDependentAssetInputs'
import { usePoolDetails } from '../context/hooks/usePoolDetails'
import { useZapAssetInput } from '../context/hooks/useZapAssetInput'
import { LiquidityMode } from '../types'

const TransactionDetails: FC = () => {
  const { i18n } = useLingui()
  const [, pool] = useRecoilValue(poolAtom)
  const poolBalance = useRecoilValue(poolBalanceAtom)
  const { parsedAmounts } = useDependentAssetInputs()
  const { parsedSplitAmounts } = useZapAssetInput()
  const liquidityMode = useRecoilValue(liquidityModeAtom)
  const { price, currentPoolShare, liquidityMinted, poolShare } = usePoolDetails(
    liquidityMode === LiquidityMode.ZAP ? parsedSplitAmounts : parsedAmounts
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <Typography weight={700} className="text-high-emphesis">
          {i18n._(t`Transaction Details`)}
        </Typography>
        <TransactionDetailsExplanationModal>
          <Typography weight={700} variant="sm" className="text-blue">
            {i18n._(t`What do these mean?`)}
          </Typography>
        </TransactionDetailsExplanationModal>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between">
          <Typography variant="sm" className="text-secondary">
            1 {pool?.token0?.symbol}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            {price ? price.toSignificant(6) : '0.000'} {pool?.token1?.symbol}
          </Typography>
        </div>
        <div className="flex flex-row justify-between">
          <Typography variant="sm" className="text-secondary">
            1 {pool?.token1?.symbol}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            {price ? price.invert().toSignificant(6) : '0.000'} {pool?.token0?.symbol}
          </Typography>
        </div>
        <div className="flex flex-row justify-between">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Minimum Received`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            {liquidityMinted?.toSignificant(6) || '0.000'} SLP
          </Typography>
        </div>
        <div className="flex flex-row justify-between">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Your Pool Tokens`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            {poolBalance?.greaterThan(0) ? poolBalance?.toSignificant(6) : '0.000'} →{' '}
            <span className="text-green">
              {poolBalance && liquidityMinted ? poolBalance.add(liquidityMinted)?.toSignificant(6) : '0.000'} SLP
            </span>
          </Typography>
        </div>
        <div className="flex flex-row justify-between">
          <Typography variant="sm" className="text-secondary">
            {i18n._(t`Your Pool Share`)}
          </Typography>
          <Typography weight={700} variant="sm" className="text-high-emphesis">
            {'<'} {currentPoolShare?.greaterThan(0) ? currentPoolShare?.toSignificant(6) : '0.000'} →{' '}
            <span className="text-green">{poolShare?.toSignificant(6) || '0.000'}%</span>
          </Typography>
        </div>
        {/*<div className="flex flex-row justify-between">*/}
        {/*  <Typography variant="sm" className="text-secondary">*/}
        {/*    {i18n._(t`Liquidity Provider Fee`)}*/}
        {/*  </Typography>*/}
        {/*  <Typography weight={700} variant="sm" className="text-high-emphesis">*/}
        {/*    0.00283 ETH*/}
        {/*  </Typography>*/}
        {/*</div>*/}
        {/*<div className="flex flex-row justify-between">*/}
        {/*  <Typography variant="sm" className="text-secondary">*/}
        {/*    {i18n._(t`Network Fee`)}*/}
        {/*  </Typography>*/}
        {/*  <Typography weight={700} variant="sm" className="text-high-emphesis">*/}
        {/*    0.008654 ETH*/}
        {/*  </Typography>*/}
        {/*</div>*/}
      </div>
    </div>
  )
}

export default TransactionDetails
