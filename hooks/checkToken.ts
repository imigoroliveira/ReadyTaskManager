import { useRouter } from "expo-router";
import { useEffect } from "react";
import { getToken } from "./tokenStorage";

export function useAuth() {
  const router = useRouter();

  async function isTokenValid() {
    const token = await getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Date.now() / 1000;

      return payload.exp > now;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    async function validateToken() {
      const token = await getToken();
      const valid = isTokenValid();

      if (!valid) {
        router.replace("/login");
      }
    }

    validateToken();
  }, [router]);
}
