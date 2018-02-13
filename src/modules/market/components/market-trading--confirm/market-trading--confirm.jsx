import React from 'react'
import BigNumber from 'bignumber.js'
import speedomatic from 'speedomatic'
import { CreateMarketEdit } from 'modules/common/components/icons/icons'

import ValueDenomination from 'modules/common/components/value-denomination/value-denomination'

import getValue from 'utils/get-value'

import { MARKET, LIMIT } from 'modules/transactions/constants/types'

import Styles from 'modules/market/components/market-trading--confirm/market-trading--confirm.styles'

const MarketTradingConfirm = (p) => {
  const tradingFees = getValue(p, 'trade.totalFee')
  const feePercent = getValue(p, 'trade.totalFeePercent')
  const potentialEthProfit = getValue(p, 'trade.potentialEthProfit')
  const potentialProfitPercent = getValue(p, 'trade.potentialProfitPercent')
  const potentialEthLoss = getValue(p, 'trade.potentialEthLoss')
  const potentialLossPercent = getValue(p, 'trade.potentialLossPercent')
  const totalCost = getValue(p, 'trade.totalCost')
  // console.log('mcp', p);
  return (
    <section className={Styles.TradingConfirm}>
      <div className={Styles.TradingConfirm__header}>
        <h2>Confirm { p.selectedNav } order?</h2>
        <button onClick={p.prevPage}>{ CreateMarketEdit }</button>
      </div>
      <ul className={Styles.TradingConfirm__details}>
        { !p.isMobile &&
          <li>
            <span>Outcome</span>
            <span>{ p.selectedOutcome.name }</span>
          </li>
        }
        { p.orderType === MARKET &&
          <li>
            <span>Total Cost</span>
            <span>{ p.marketOrderTotal instanceof BigNumber ? p.marketOrderTotal.toNumber() : p.marketOrderTotal } ETH</span>
          </li>
        }
        { p.orderType === LIMIT &&
          <li>
            <span>Quantity</span>
            <span>{ p.orderQuantity instanceof BigNumber ? p.orderQuantity.toNumber() : p.orderQuantity } Shares</span>
          </li>
        }
        { p.orderType === LIMIT &&
          <li>
            <span>Limit Price</span>
            <span>{ p.orderPrice instanceof BigNumber ? p.orderPrice.toNumber() : p.orderPrice } ETH</span>
          </li>

        }
        <li>
          <span>Fee</span>
          <span>{tradingFees.formattedValue} <span>ETH ({feePercent.formattedValue}%)</span></span>
        </li>
      </ul>
      { p.orderType === LIMIT &&
        <ul className={Styles.TradingConfirm__total}>
          <li>
            <span>Total Cost</span>
            <span><ValueDenomination formatted={totalCost.formatted} /> <span>ETH</span></span>
          </li>
        </ul>
      }
      { p.orderType === MARKET &&
        <ul className={Styles.TradingConfirm__total}>
          <li>
            <span>Quantity</span>
            <span>{ p.marketQuantity }</span>
          </li>
        </ul>
      }
      <ul className={Styles.TradingConfirm__potential}>
        <li>
          <span>Potential Profit</span>
          <span><ValueDenomination formatted={potentialEthProfit.formatted} /> <span>ETH ({potentialProfitPercent.formatted}%)</span></span>
        </li>
        <li>
          <span>Potential Loss</span>
          <span><span><ValueDenomination formatted={potentialEthLoss.formatted} /> <span>ETH ({potentialLossPercent.formatted}%)</span></span></span>
        </li>
      </ul>
      <div className={Styles.TradingConfirmation__actions}>
        <button
          className={Styles['TradingConfirmation__button--back']}
          onClick={p.prevPage}
        >Back
        </button>
        <button
          className={Styles['TradingConfirmation__button--submit']}
          onClick={(e) => {
            p.market.onSubmitPlaceTrade(p.selectedOutcome.id, (err, tradeGroupID) => {
              if (!err) p.toggleShowOrderPlaced()
              console.log('onSent/Failed:');
              console.log(err);
              if (err && err.input) {
                console.log('failedTX:', JSON.stringify(err, null, 2))
                console.log(speedomatic.fix(err.input, 'string'));
                console.log(speedomatic.unfix(err.input, 'string'));
              }
            }, (res) => {
              console.log('Complete!', res);
            }, (p.orderType === MARKET))
            p.clearOrderForm()
            p.prevPage()
          }}
        >Confirm
        </button>
      </div>
    </section>
  )
}

export default MarketTradingConfirm
