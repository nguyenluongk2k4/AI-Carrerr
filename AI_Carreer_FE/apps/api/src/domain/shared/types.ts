export type UniqueId = string;

export type Percentage = number; // 0..100
export type Score = number;
export type Currency = "VND";

export interface Money {
  amount: number;
  currency: Currency;
}

export interface TimeRange {
  fromMonth: number;
  toMonth: number;
}

export interface Pagination {
  page: number;
  pageSize: number;
}
