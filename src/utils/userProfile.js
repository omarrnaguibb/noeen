const STORAGE_KEY = "noeen_user_profile";

export function getUserProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.fullName) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
