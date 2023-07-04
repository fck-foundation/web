import { JType } from "contexts";
import { _ } from "./number";
import { Item } from "components";

export const getList = (data: Record<number, any>, jettons?: JType[]): Item[] =>
  Object.keys({ ...data }).map((id) => {
    const stats = [
      ...(Array.isArray(data[parseInt(id)])
        ? data[parseInt(id)]
        : [data[parseInt(id)] as Record<string, any>]),
    ].map((item) => ({
      value: _(item.price_close),
      volume: item.volume,
    }));
    const jetton = jettons?.find((i) => i.id === parseInt(id));
    const chart = [...stats]
    .map(({ value }: { value: number }, i: number) => ({
      value:
        i > 0 && value && stats[i - 1].value && stats[i - 1].value !== value
          ? stats[i - 1].value < value
            ? value && value - 10
            : value && value + 10
          : stats[stats.length - 1].value < value
          ? value && value + 10 * 10
          : value && value - 10 * 2,
    }));
    const volume = [...(stats || [])].reduce((acc, i) => (acc += i?.volume), 0);
    const percent = stats && !!stats[0]?.value
      ? ((stats[stats.length - 1]?.value - stats[0]?.value) /
          stats[0]?.value) *
        100
      : 0;

    return {
      id: jetton?.id,
      name: jetton?.symbol || "",
      image: jetton?.image || "",
      price: stats[stats.length - 1]?.value || 0,
      chart,
      volume,
      percent,
      decimals: jetton?.decimals || 9,
      color:
        !isNaN(percent) && percent !== 0
          ? percent > 0
            ? "#1ac964"
            : "#f31260"
          : "gray",
      stats: jetton?.stats,
      verified: !!jetton?.verified,
    };
  });
