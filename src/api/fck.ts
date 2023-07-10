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
    signal: any,
    limit = 10,
    offset = 0,
  ) => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v3/analytics/preview/recentlyAdded?count=${limit}${offset? `&offset=${offset}` : ''}`,
      { signal }
    );
    return data;
  },
  getPromoting: async (
    signal: any,
    limit = 10,
    offset = 0,
  ) => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v3/analytics/preview/promoting?count=${limit}${offset? `&offset=${offset}` : ''}`,
      { signal }
    );
    return data;
  },
  getPairs: async ({ signal, jetton_ids = '', limit, offset }) => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v3/jettons/pairs?limit=${limit}&offset=${offset}&jetton_ids=${jetton_ids}`,
      { signal }
    );
    return data;
  },
  getTrending: async (
    signal: any,
    limit = 10,
    offset = 0,
  ) => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v3/analytics/preview/trending?count=${limit}${offset? `&offset=${offset}` : ''}`,
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
