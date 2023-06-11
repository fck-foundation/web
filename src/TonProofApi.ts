import cookie from "react-cookies";
import {
  Account,
  ConnectAdditionalRequest,
  TonConnect,
  TonConnectOptions,
  TonProofItemReplySuccess,
} from "@tonconnect/sdk";
import "./patch-local-storage-for-github-pages";

const options: TonConnectOptions = {
  manifestUrl:
    "https://raw.githubusercontent.com/fck-foundation/web/master/public/tonconnect-manifest.json",
};

export const connector = new TonConnect(options);

export class TonProofApiService {
  private storageKey = "access-token";

  host = "https://demo.tonconnect.dev";

  accessToken: string | null = null;

  public readonly refreshIntervalMs = 9 * 60 * 1000;

  constructor() {
    this.accessToken = localStorage.getItem(this.storageKey);

    if (!this.accessToken) {
      this.generatePayload();
    }
  }

  async generatePayload(): Promise<ConnectAdditionalRequest | null> {
    try {
      const response = await (
        await fetch(`${this.host}/ton-proof/generatePayload`, {
          method: "POST",
        })
      ).json();
      return { tonProof: response.payload as string };
    } catch {
      return null;
    }
  }

  async checkProof(proof: TonProofItemReplySuccess["proof"], account: Account) {
    try {
      const reqBody = {
        address: account.address,
        network: account.chain,
        proof: {
          ...proof,
          state_init: account.walletStateInit,
        },
      };

      const response = await (
        await fetch(`https://api.fck.foundation/api/v2/ton-connect/auth`, {
          method: "POST",
          body: JSON.stringify(reqBody),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
      ).json();

      console.log("PROF RESPONSE:", response);

      if (response?.data?.token) {
        cookie.save(this.storageKey, response?.data?.token, { path: "/" });
        globalThis.localStorage.setItem(this.storageKey, response?.data?.token);
        this.accessToken = response?.data?.token;
      }
    } catch (e) {
      console.log("checkProof error:", e);
    }
  }

  async getAccountInfo(account: Account) {
    const response = await (
      await fetch(`${this.host}/dapp/getAccountInfo?network=${account.chain}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      })
    ).json();

    return response as {};
  }

  reset() {
    this.accessToken = null;
    localStorage.removeItem(this.storageKey);
    this.generatePayload();
  }
}

const TonProofApi = new TonProofApiService();

export default TonProofApi;
