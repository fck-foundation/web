import { JType } from "contexts";
import moment from "moment";
import { _ } from "./number";
import { Item } from "components";
import { PairType } from "hooks";

export const getList = (
  data: Record<number, any>,
  jettons?: JType[],
  pairs?: PairType
): Item[] =>
  Object.keys({ ...data }).map((pairId) => {
    const id = pairs
      ?.find(({ id }) => id.toString() === pairId)
      ?.jetton1_id?.toString() as string;

    const stats = data[pairId]
      .sort(
        (x, y) =>
          new Date(x.period as any).getTime() -
          new Date(y.period as any).getTime()
      )
      ?.map((item) => ({
        value: _(item.price_close),
        volume: _(item.pair2_volume),
      }));
    const jetton = jettons?.find((i) => i.id.toString() === id);
    const chart = [...stats].map(({ value }: { value: number }, i: number) => ({
      value,
    }));
    const volume = [...(stats || [])].reduce((acc, i) => (acc += i?.pair2_volume), 0);
    const percent =
      ((stats[stats.length - 2]?.value - stats[stats.length - 3]?.value) /
        stats[stats.length - 3]?.value) *
      100;

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
            : "#F54244"
          : "gray",
      stats: jetton?.stats,
      verified: !!jetton?.verified,
    };
  });
