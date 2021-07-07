export interface IActionBar {
  label: string;
  path: string;
  icon: string;
  id: string;
}

export interface IBalanceResponse {
  balance: IBalance;
  status: string;
  branch: string;
  number: string;
}

export interface IBalance {
  inProcess: {
    amount: number;
    currency: string;
  };
  available: {
    amount: number;
    currency: string;
  };
  blocked: {
    amount: number;
    currency: string;
  };
}
