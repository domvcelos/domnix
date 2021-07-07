export interface INotification {
  category: string;
  client_id: string;
  created: string;
  extra_data: any;
  id: string;
  message: string;
  modified: string;
  origin: number;
  read: boolean;
  send_push: boolean;
  social_security: string;
  title: string;
}

export interface INotificationResponse {
  count: number;
  next: any;
  previous: any;
  results: INotification[];
}

export interface INotificationStatusListSelect {
  status_type: true | false;
  label: 'Lido' | 'Não lido';
}

export interface INotificationTopicsListSelect {
  topic_type: string;
  label: string;
}

export interface INotificationsFilter {
  offset: number;
  limit: number;
  initial_created?: string;
  final_created?: string;
  message?: string;
  category?: string;
  read?: string;
  ordering?: string;
}

export interface IConfigNotificationResponse {
  deposit: boolean;
  charge: boolean;
  transfer: boolean;
  id: string;
  company: string;
  created: string;
  modified: string;
}
