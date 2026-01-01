// src/app/models/job-source.model.ts
export interface JobSource {
  id?: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: 'General' | 'Tech' | 'Remote' | 'Design'|'Finance'|'Health'|'Retail';
  color: string;
}
