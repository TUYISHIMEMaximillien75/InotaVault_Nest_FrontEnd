import api from "./axios";

export const getMyNotifications = () => {
  return api.get("/notifications");
};

export const markNotificationAsRead = (id: string) => {
  return api.patch(`/notifications/${id}/read`);
};
