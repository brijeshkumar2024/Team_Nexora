import { api, unwrap } from "./api";

export const applicationService = {
  submit: (payload) => unwrap(api.post("/applications", payload)),
  list: (params = {}) => unwrap(api.get("/applications", { params })),
  update: (id, payload) => unwrap(api.patch(`/applications/${id}`, payload)),
  listByProject: (projectId) => unwrap(api.get(`/applications/project/${projectId}`)),
  exportCsvUrl: (projectId) =>
    `${api.defaults.baseURL}/applications/export/csv${projectId ? `?project=${projectId}` : ""}`
};
