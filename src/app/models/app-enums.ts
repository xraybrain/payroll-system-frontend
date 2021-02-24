import { environment } from "src/environments/environment";

export enum ViewModes {
  MainView,
  EditView,
  NewItemView,
  BankScheduleView,
  PaymentSlipView,
}

export enum MessageboxResponse {
  CANCEL,
  OK,
  CLOSE,
}

export enum MessageboxType {
  WARNING,
  INFO,
  SUCCESS,
}

export enum RegisterViewModes {
  MainView,
  UserBioDataView,
}

export class baseUrl {
  static host = `${environment.production ? "" : "http://localhost:3000/"}`;
}

export enum MiscellanousType {
  Allowance,
  Deduction,
}

export enum PayrollStatus {
  Pending,
  Calculated,
}

