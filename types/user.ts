export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  member_since: string;
}

export interface UserProfile extends User {
  membership_type: string;
  preferred_location: PreferredLocation | null;
}

export interface PreferredLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface AuthData {
  user: User;
  tokens: AuthTokens;
}
