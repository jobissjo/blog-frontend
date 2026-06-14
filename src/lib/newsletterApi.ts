import apiClient from "./api";

export const subscribeNewsletter = (email: string) => {
  return apiClient.post("api/newsletter/subscribe", { email });
};
