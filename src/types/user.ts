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
  // 'active' = current merchant · 'inactive' = deactivated (can reactivate) · null = never a merchant
  merchant_status: "active" | "inactive" | null;
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

// Backend includes merchant_id on the user object in the login/register response
export interface AuthUser extends User {
  merchant_id?: string | null;
}

export interface AuthData {
  user: AuthUser;
  tokens: AuthTokens;
}
