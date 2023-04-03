import { Currency, CurrencyAmount } from '@sushiswap/core-sdk'
import { ChainId, WNATIVE_ADDRESS } from 'app/constants/extension'
import { NATIVE } from 'app/constants/extension/native'

export function unwrappedToken(currency: Currency): Currency {
  if (currency.isNative) return currency

  // @ts-ignore TYPE NEEDS FIXING
  if (currency.chainId in ChainId && currency.address === WNATIVE_ADDRESS[currency.chainId])
    return NATIVE[currency.chainId]

  return currency
}

export function unwrappedCurrencyAmount(amount?: CurrencyAmount<Currency>): CurrencyAmount<Currency> | undefined {
  if (!amount) return

  const native = NATIVE[amount.currency.chainId]
  return CurrencyAmount.fromRawAmount(native, amount.quotient)
}

export const isWrappedReturnNativeSymbol = (chainId: ChainId | undefined, address: string): string => {
  if (!chainId) return address
  if (address.toLowerCase() === WNATIVE_ADDRESS[chainId].toLowerCase()) {
    // @ts-ignore TYPE NEEDS FIXING
    return NATIVE[chainId].symbol
  }

  return address
}
