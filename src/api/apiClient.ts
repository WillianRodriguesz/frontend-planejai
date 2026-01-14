const API_URL = import.meta.env.VITE_API_URL;

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private buildURL(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return url.toString();
  }

  async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...fetchOptions } = options;
    const url = this.buildURL(endpoint, params);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      credentials: "include",
      ...fetchOptions,
    });

    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes("/auth/login")) {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        throw new Error("Sessão expirada");
      }

      let errorMessage = "Erro desconhecido";
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else {
          switch (response.status) {
            case 400:
              errorMessage = "Dados inválidos fornecidos";
              break;
            case 401:
              errorMessage = "Credenciais inválidas";
              break;
            case 403:
              errorMessage = "Acesso negado";
              break;
            case 404:
              errorMessage = "Recurso não encontrado";
              break;
            case 409:
              errorMessage = "Conflito de dados";
              break;
            case 500:
              errorMessage = "Erro interno do servidor";
              break;
            default:
              errorMessage = `Erro na requisição: ${response.statusText}`;
          }
        }
      } catch {
        switch (response.status) {
          case 400:
            errorMessage = "Dados inválidos fornecidos";
            break;
          case 401:
            errorMessage = "Credenciais inválidas";
            break;
          case 403:
            errorMessage = "Acesso negado";
            break;
          case 404:
            errorMessage = "Recurso não encontrado";
            break;
          case 409:
            errorMessage = "Conflito de dados";
            break;
          case 500:
            errorMessage = "Erro interno do servidor";
            break;
          default:
            errorMessage = `Erro na requisição: ${response.statusText}`;
        }
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_URL);
