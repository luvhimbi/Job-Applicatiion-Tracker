export interface CareerRole {
  id: string;
  title: string;
  industry: 'Finance' | 'Tech' | 'Retail' | 'Data';
  salaryRange: string; // e.g., "R450k - R900k"
  description: string;
  whoShouldApply: string[];
  dayInLife: string;
  skillsNeeded: string[];
}
