const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
  headers?: Record<string, string>;
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, token, headers = {} } = options;

    const finalHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`\( {this.baseUrl} \){endpoint}`, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  // Auth
  login(data: { phoneNumber: string; password?: string }) {
    return this.request("/auth/login", { method: "POST", body: data });
  }

  // Users
  getMe(token: string) {
    return this.request("/users/me", { token });
  }

  // Teachers
  getTutor(id: string) {
    return this.request(`/teachers/${id}`);
  }

  // Jobs
  createJob(data: unknown, token: string) {
    return this.request("/jobs", { method: "POST", body: data, token });
  }

  // Contracts
  getContract(id: string, token: string) {
    return this.request(`/contracts/${id}`, { token });
  }

  // Chat
  // (Real-time is handled via WebSocket – this is for history)
  getMessages(roomId: string, token: string) {
    return this.request(`/chat/${roomId}/messages`, { token });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
