import { api, unwrap } from "./api";

export const authService = {
  login: (payload) => unwrap(api.post("/auth/login", payload)),
  me: () => unwrap(api.get("/auth/me"))
};
