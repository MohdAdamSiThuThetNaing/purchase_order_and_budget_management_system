let accessToken: string | null = null;

export const authTokenStore = {
  set(token: string | null) {
    accessToken = token;
  },
  get() {
    return accessToken;
  },
  clear() {
    accessToken = null;
  },
};
