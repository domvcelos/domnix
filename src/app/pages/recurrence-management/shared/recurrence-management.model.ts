export interface IRecurrencePlan {
  name: string;
  description: string;
  interval: number;
  amount: number;
  created: string;
  active: boolean;
  id: string;
  recurrences?: number;
}
export interface IPaymentType {
  type: string;
  label: string;
}
export interface IRecurrence {
  id: string;
  created: string;
  modified: string;
  plan_id: string;
  plan_name: string;
  plan_interval: number;
  plan_amount: number;
  start_date: string;
  next_date: string;
  end_date: string;
  customer_name: string;
  customer_identity: string;
  customer_identity_type: string;
  customer_email: string;
  payment_type: string;
  comments: string;
  checkout_url: string;
  checkout_url_expiration: string;
  status: number;
  company: string;
}
export interface DataRecurrence {
  offset: number;
  count: number;
  limit: number;
  results: IRecurrence[];
}
export interface Interval {
  id: number;
  label: string;
}
export interface IStatusRecurrence {
  id: number;
  label: string;
}

export interface IStatusPlanRecurrence {
  status: boolean;
}

export interface IEditSubscriptionRecurrence {
  plan_id: string;
  plan_name: string;
  plan_interval: number;
  plan_amount: number;
  active: boolean;
  next_date: string;
  comments: string;
}
