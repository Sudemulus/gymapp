import { getToken } from "@/lib/authToken";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(body?.error || `Request failed with status ${res.status}`);
  }

  return body;
}

export function register(data) {
  return request("/api/users/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data) {
  return request("/api/users/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getMe() {
  return request("/api/users/me");
}

export function updateProfile(data) {
  return request("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function changePassword(data) {
  return request("/api/users/password", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function forgotPassword(data) {
  return request("/api/users/forgot-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function resetPassword(data) {
  return request("/api/users/reset-password", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getExercises(muscleGroup) {
  const query = muscleGroup ? `?muscleGroup=${encodeURIComponent(muscleGroup)}` : "";
  return request(`/api/exercises${query}`);
}

export function getExerciseById(id) {
  return request(`/api/exercises/${id}`);
}

export function createExercise(data) {
  return request("/api/exercises", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getLastPerformance(exerciseId) {
  return request(`/api/exercises/${exerciseId}/last-performance`);
}

export function getWorkouts() {
  return request("/api/workouts");
}

export function getWorkoutById(id) {
  return request(`/api/workouts/${id}`);
}

export function createWorkout(data) {
  return request("/api/workouts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function addSetToWorkout(workoutId, data) {
  return request(`/api/workouts/${workoutId}/sets`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function repeatWorkout(workoutId) {
  return request(`/api/workouts/${workoutId}/repeat`, {
    method: "POST",
  });
}

export function updateWorkoutSet(setId, data) {
  return request(`/api/workout-sets/${setId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteWorkoutSet(setId) {
  return request(`/api/workout-sets/${setId}`, {
    method: "DELETE",
  });
}

export function getVolumeAnalytics() {
  return request("/api/analytics/volume");
}

export function getBodyStats() {
  return request("/api/body-stats");
}

export function createBodyStat(data) {
  return request("/api/body-stats", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateBodyStat(id, data) {
  return request(`/api/body-stats/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteBodyStat(id) {
  return request(`/api/body-stats/${id}`, {
    method: "DELETE",
  });
}
