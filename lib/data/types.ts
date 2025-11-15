export type DocumentRecord = {
  id: string;
  user_id: string;
  title: string;
  storage_path: string;
  created_at: string;
  status: 'processing' | 'completed' | 'error';
};

export type SubscriptionRecord = {
  id: string;
  user_id: string;
  plan: string;
  status: string;
  current_period_end: string;
};
