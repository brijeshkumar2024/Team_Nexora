import { api, unwrap } from "./api";

export const contactService = {
  submit: (payload) => unwrap(api.post("/contact", payload)),
  list: (params = {}) => unwrap(api.get("/contact", { params })),
  updateStatus: (id, payload) => unwrap(api.patch(`/contact/${id}`, payload))
};
