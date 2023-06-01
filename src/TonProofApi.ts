import {
  Account,
  ConnectAdditionalRequest,
  TonProofItemReplySuccess,
} from "@tonconnect/sdk";
import "./patch-local-storage-for-github-pages";

class TonProofApiService {
  private localStorageKey = "access-token";

  private host = "https://demo.tonconnect.dev";

  public accessToken: string | null = null;

  public connectWalletRequest: Promise<ConnectAdditionalRequest> =
    Promise.resolve({});

  constructor() {
    this.accessToken = globalThis.localStorage.getItem(this.localStorageKey);

    if (!this.accessToken) {
      this.generatePayload();
    }
  }

  generatePayload() {
    this.connectWalletRequest = new Promise(async (resolve) => {
      const response = await (
        await fetch(`${this.host}/ton-proof/generatePayload`, {
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
            "Accept": "application/json"
          },
        })
      ).json();

      console.log("PROF RESPONSE:", response);

      if (response?.data?.token) {
        globalThis.localStorage.setItem(this.localStorageKey, response?.data?.token);
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
    globalThis.localStorage.removeItem(this.localStorageKey);
    this.generatePayload();
  }
}

export const TonProofApi = new TonProofApiService();