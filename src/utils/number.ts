export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function normalize(number: string, decimals: number) {
  return parseFloat(
    (
      parseFloat(number) *
      (decimals
        ? parseFloat(
            `0.${new Array((decimals > 16 ? 16 : decimals) - 1)
              .fill(0)
              .join("")}1`
          )
        : 1)
    ).toFixed(decimals > 16 ? 16 : decimals)
  );
}
export const _ = (v) => {
  return parseFloat(parseFloat(v).toFixed(9));
};


export function calculatePriceImpact(liquidityTON, liquidityJetton, amountTON, tradeFee) {

  const price = liquidityTON / liquidityJetton;
  const adjustedLiquidityTON = liquidityTON - amountTON;

  const adjustedAmountJetton = amountTON * price * (2 - tradeFee);

  const networkFee = 0.1;

  const receivedJetton = adjustedAmountJetton - networkFee;

  const receivedETH = receivedJetton / price;

  const newTotalLiquidity = adjustedLiquidityTON + receivedETH;

  const newPriceImpact = (amountTON / newTotalLiquidity) * 100; 

  return parseFloat(newPriceImpact.toFixed(2));
}