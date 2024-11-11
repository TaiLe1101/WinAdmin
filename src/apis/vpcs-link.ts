/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosClient } from "@/configs/axiosClient";
import { ResAPI, VpcsLink } from "@/types/types";

export const vpcsLinkAPI = {
  async getVpcsLinkAPI() {
    const result = await axiosClient.get<ResAPI<VpcsLink[]>>("/vpcs-link");
    return result.data;
  },

  async createVpcsLinkAPI(reqBody: any) {
    const res = await axiosClient.post<ResAPI<boolean>>(
      "/vpcs-link/create",
      reqBody
    );
    return res.data;
  },

  async deleteVpcsLinkAPI(id: string) {
    const res = await axiosClient.delete<ResAPI<boolean>>(`/vpcs-link/${id}`);
    return res.data;
  },
};
