export interface IConsolidation {
  id: number;
  when: string;
  value: number;
  type: number;
  company: string;
}
export interface IChartBarData {
  category: string;
  performed: number;
  planned: number;
}
export interface IConsolidationsFilters {
  limit: string;
  begin: string;
  end: string;
  date_start?: string;
  date_end?: string;
  ordering: string;
  status: number;
}
export interface IEntriesResponse {
  count: 8;
  next: null;
  previous: null;
  results: IEntry[];
}
export interface IEntry {
  id?: number;
  when?: string;
  value?: string;
  description?: string;
  type?: number;
  status?: number;
  situation?: number;
  entity_id?: string;
  entity_name?: string;
  origin_name?: string;
  queue_name?: string;
  registration?: string;
  group_registration?: string;
  account?: string;
  agency?: string;
  bank?: string;
  partner_registration?: string;
  partner_name?: string;
  issue_date?: string;
  date_status?: string;
  warning?: boolean;
  days_to_expire?: number;
}
export interface IEntriesFilter {
  page: number;
  limit: number;
  date_start?: string;
  date_end?: string;
  begin?: string;
  end?: string;
  ordering?: string;
  status?: number;
  type?: number;
}
