import { api, unwrap } from "./api";

export const adminService = {
  stats: () => unwrap(api.get("/admin/stats"))
};
