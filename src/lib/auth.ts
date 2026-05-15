export type UserProfile = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

export type AppSession = {
  accessToken: string;
  accessTokenExpiresAt: string;
  idToken: string;
  scope?: string;
  profile: UserProfile;
};
