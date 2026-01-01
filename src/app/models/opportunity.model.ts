export interface Opportunity {
  id?: string;
  company: string;
  title: string;
  type: 'Internship' | 'Learnership';
  description: string;
  window: string;
  link: string;
  createdAt?: any;
}
