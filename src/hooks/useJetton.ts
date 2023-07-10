import { JType } from "contexts";
import { useMemo } from "react";

export function useJetton(
  symbol?: string,
  jettons?: JType[]
): JType | undefined {
  const result = useMemo(
    () =>
      jettons?.find(
        (jetton) => jetton.symbol !== "TON" && jetton.symbol === symbol
      ),
    [jettons, symbol]
  );

  return (
    result ||
    ({
      name: "Toncoin",
      image: "https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png",
      symbol: "TON",
      decimals: 9,
    } as JType)
  );
}
