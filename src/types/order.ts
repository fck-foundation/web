import { JType } from "contexts";

export enum OrderStatus {
  Pending = "pending",
  Success = "success",
  Deleted = "deleted",
}

export interface OrderDataInfo {
  uri: string;
  wallet: string;
  comment: string;
}

export interface OrderDataMerchant {
  id: number;
  name: string;
  description: string;
  wallet: string;
}

export interface OrderDataStats {
  expires_at: string;
  amount: number;
  status: OrderStatus;
  comment: string;
  rate_by_currency: string;
  uuid: string;
  updated_at: string;
  created_at: string;
  merchant: OrderDataMerchant;
}

export interface OrderData {
  info: OrderDataInfo;
  order: OrderDataStats;
}

export interface Order {
  data: OrderData;
}

export interface CurrentPrice {
  price: number,
  jetton: JType;
}
