import { api, unwrap } from "./api";

export const projectService = {
  list: (params = {}) => unwrap(api.get("/projects", { params })),
  getBySlug: (slug) => unwrap(api.get(`/projects/${slug}`)),
  create: (payload) => unwrap(api.post("/projects", payload)),
  update: (id, payload) => unwrap(api.patch(`/projects/${id}`, payload)),
  remove: (id) => unwrap(api.delete(`/projects/${id}`))
};
