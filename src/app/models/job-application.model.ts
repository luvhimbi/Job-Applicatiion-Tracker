export interface JobApplication {
  id?: string;
  companyName: string;
  jobTitle: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  applicationDate: Date;
  location: string;
  notes?: string;
  createdAt: Date;
  contacts?: Array<{ name: string; role: string; email: string }>;
}
export type JobStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';
