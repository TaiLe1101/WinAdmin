import axios from "axios";
// const endpoint = "http://localhost:11118/api/v1";
const endpoint = "https://api-admin.devt.id.vn/api/v1";

const axiosClient = axios.create({
  baseURL: endpoint,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosClient };
