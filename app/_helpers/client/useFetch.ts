import { useRouter } from "next/navigation";

export { useFetch };

function useFetch() {
  const router = useRouter();

  return {
    get: request("GET"),
    post: request("POST"),
    put: request("PUT"),
    delete: request("DELETE"),
  };

  function request(method: string) {
    return (url: string, body?: any) => {
      const requestOptions: any = {
        method,
      };
      if (body) {
        requestOptions.headers = { "Content-Type": "application/json" };
        requestOptions.body = JSON.stringify(body);
      }
      return fetch(url, requestOptions).then(handleResponse);
    };
  }

  // funções uteis

  async function handleResponse(response: any) {
    const isJson = response.headers
      ?.get("content-type")
      ?.includes("application/json");
    const data = isJson ? await response.json() : null;

    // checar se a requisição retornou um erro
    if (!response.ok) {
      if (response.status === 401) {
        // api automaticamente desloga em 401 Unauthorized e redireciona para a tela de login
        router.push("/account/login");
      }

      // pega a msg de erro do body ou default para o status response
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  }
}
