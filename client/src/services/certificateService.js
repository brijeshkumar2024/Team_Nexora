import { api, unwrap } from "./api";

export const certificateService = {
  listTemplates: () => unwrap(api.get("/certificates/templates")),
  createTemplate: (payload) => unwrap(api.post("/certificates/templates", payload)),
  listRecords: () => unwrap(api.get("/certificates/records")),
  createRecord: (payload) => unwrap(api.post("/certificates/records", payload)),
  approveRecord: (id) => unwrap(api.patch(`/certificates/records/${id}/approve`))
};
