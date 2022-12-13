import { useContext, useState } from "react";
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { AuthContext } from "../contexts/AuthContext";

const useHttp = () => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getAuthHeader = () => {
    return authCtx.token
      ? {
          headers: { Authorization: `Bearer ${authCtx.token}` },
        }
      : {};
  };

  const handleError = (error: Error | AxiosError) => {
    setLoading(false);

    if (axios.isAxiosError(error)) {
      const data: any = error.response?.data;

      if (data && data.detail) {
        setError(data.detail);
      } else {
        setError(error.message);
      }
    } else {
      setError("An unknown error occurred");
    }
  };

  return {
    error,
    loading,
    get: async (
      path: string,
      config: AxiosRequestConfig = {}
    ): Promise<AxiosResponse | void> => {
      setLoading(true);
      setError("");

      try {
        config.headers = { ...getAuthHeader().headers, ...config.headers };
        const response = await axios.get(path, config);
        setLoading(false);
        return response;
      } catch (error) {
        return handleError(error as Error);
      }
    },
    post: async (
      path: string,
      data: object = {},
      config: AxiosRequestConfig = {}
    ): Promise<AxiosResponse | void> => {
      setLoading(true);
      setError("");
      config.headers = { ...getAuthHeader().headers, ...config.headers };
      try {
        const response = await axios.post(path, data, config);
        setLoading(false);
        return response;
      } catch (error) {
        console.error(error);
        return handleError(error as AxiosError);
      }
    },

    put: async (
      path: string,
      data: object = {},
      config: AxiosRequestConfig = {}
    ): Promise<AxiosResponse | void> => {
      setLoading(true);
      setError("");
      config.headers = { ...getAuthHeader().headers, ...config.headers };
      try {
        const response = await axios.put(path, data, config);
        setLoading(false);
        return response;
      } catch (error) {
        console.log(error);
        return handleError(error as AxiosError);
      }
    },

    delete: async (
      path: string,
      config: AxiosRequestConfig = {}
    ): Promise<AxiosResponse | void> => {
      setLoading(true);
      setError("");
      config.headers = { ...getAuthHeader().headers, ...config.headers };
      try {
        const response = await axios.delete(path, config);
        setLoading(false);
        return response;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },
  };
};

export default useHttp;
