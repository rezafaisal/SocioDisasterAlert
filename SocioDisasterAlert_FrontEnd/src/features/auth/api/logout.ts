import storage from "@/utils/storage";

export async function logout() {
  storage.clearToken();
  window.location.reload();
}
