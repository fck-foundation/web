import {
  Account,
  ConnectAdditionalRequest,
  TonProofItemReplySuccess,
} from "@tonconnect/sdk";
import "./patch-local-storage-for-github-pages";
import cookie from "react-cookies";

class TonProofApiService {
  private storageKey = "access-token";

  private host = "https://tonapi.io/";

  public accessToken?: string;

  public connectWalletRequest: Promise<ConnectAdditionalRequest> =
    Promise.resolve({});

  constructor() {
    this.accessToken = cookie.load(this.storageKey) as string;

    if (!this.accessToken) {
      this.generatePayload();
    }
  }

  generatePayload() {
    this.connectWalletRequest = new Promise(async (resolve) => {
      const response = await (
        await fetch(`${this.host}/v2/tonconnect/proof`, {
          method: "POST",
        })
      ).json();
      resolve({ tonProof: response.payload as string });
    });
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

      // (await this.connectWalletRequest).tonProof =
      console;

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
    this.accessToken = undefined;
    cookie.remove(this.storageKey);
    this.generatePayload();
  }
}

export const TonProofApi = new TonProofApiService();
