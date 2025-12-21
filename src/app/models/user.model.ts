export interface User {
  uid: string;           // Firebase Authentication UID
  displayName?: string;   // Optional full name
  email: string;          // Email from Auth
  createdAt: Date;        // When user registered
  role?: 'user' | 'admin'; // Optional role if needed later
  preferences?: {
    theme?: 'light' | 'dark';
    notificationsEnabled?: boolean;
  };
}
