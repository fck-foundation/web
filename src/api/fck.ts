import axios from "libs/axios";

export const fck = {
  getJettons: async (signal: any) => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v1/jettons`,
      { signal }
    );
    return data.data;
  },
  getAnalytics: async (
    jetton_ids: string,
    time: number,
    timescale: number,
    signal: any
  ) => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v2/analytics?jetton_ids=${jetton_ids}&time_min=${time}&timescale=${timescale}`,
      { signal }
    );
    return data;
  },
  getRecentlyAdded: async (
    count,
    time: number,
    timescale: number,
    signal: any
  ) => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v2/analytics/preview/recentlyAdded?onlyJettons=false&count=${count}&time_min=${time}&timescale=${timescale}`,
      { signal }
    );
    return data;
  },
  getPromoting: async (count, time: number, timescale: number, signal: any) => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v2/analytics/preview/promoting?onlyJettons=false&count=${count}&time_min=${time}&timescale=${timescale}`,
      { signal }
    );
    return data;
  },
  getTrending: async (count, time: number, timescale: number, signal: any) => {
    const { data } = await axios.get(
      `https://api.fck.foundation/api/v2/analytics/preview/trending?onlyJettons=false&count=${count}&time_min=${time}&timescale=${timescale}`,
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
};
