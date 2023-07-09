import TonProofApi from "TonProofApi";
import axios from "libs/axios";
import { CurrentPrice, Order, OrderData } from "types";

export const fck = {
  getJettons: async (signal: any) => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v1/jettons`,
      { signal }
    );
    return data.data;
  },
  getRecentlyAdded: async (
    timescale: number,
    currency = "",
    signal: any
  ) => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v3/analytics/preview/recentlyAdded?onlyJettons=false&count=${10}&period=${timescale}&currency=${(
        currency || "ton"
      ).toLowerCase()}`,
      { signal }
    );
    return data;
  },
  getPromoting: async (
    timescale: number,
    currency = "",
    signal: any
  ) => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v3/analytics/preview/promoting?onlyJettons=false&count=${10}&period=${timescale}&currency=${(
        currency || "ton"
      ).toLowerCase()}`,
      { signal }
    );
    return data;
  },
  getPairs: async ({ signal, limit, offset }) => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v3/jettons/pairs?limit=${limit}&offset=${offset}`,
      { signal }
    );
    return data;
  },
  getTrending: async (
    timescale: number,
    currency = "",
    signal: any
  ) => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v3/analytics/preview/trending?onlyJettons=false&count=${10}&period=${timescale}&currency=${(
        currency || "ton"
      ).toLowerCase()}`,
      { signal }
    );
    return data;
  },
  getSwapsCount: async (jetton_ids: string, time: number, signal: any) => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v2/analytics/swaps/count?jetton_ids=${jetton_ids}&time_min=${time}`,
      { signal }
    );
    return data;
  },
  generateOrder: async (order: any): Promise<Order> => {
    const { data } = await axios.post(
      `https://api.fck.foundation/api/v2/rating/generateVoiceOrder`,
      order,
      {
        headers: {
          Authorization: `Bearer ${TonProofApi.accessToken}`,
        },
      }
    );
    return data;
  },
  getOrder: async ({ signal, id }: any): Promise<OrderData> => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v2/payments/order?uuid=${id}`,
      {
        signal,
      }
    );
    return data.data;
  },
  getPrice: async ({ signal }: any): Promise<CurrentPrice> => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v2/rating/currentPrice`,
      {
        signal,
      }
    );
    return data;
  },
};
