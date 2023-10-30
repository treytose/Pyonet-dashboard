import { useContext, useState, useEffect } from "react";
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

  const prependBaseUrl = (path: string) => {
    return path.startsWith("/api") ? path : `/api${path}`;
  };

  const handleError = (error: Error | AxiosError) => {
    setLoading(false);

    if (axios.isAxiosError(error)) {
      const data: any = error.response?.data;

      if (data && data.detail) {
        setError(data.detail);
      } else {
        setError(error.message.toString());
      }
    } else {
      setError("An unknown error occurred");
    }
  };

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

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
        const response = await axios.get(prependBaseUrl(path), config);
        setTimeout(() => setLoading(false), 100);
        // setLoading(false);
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
        const response = await axios.post(prependBaseUrl(path), data, config);
        setTimeout(() => setLoading(false), 100);
        // setLoading(false);
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
        const response = await axios.put(prependBaseUrl(path), data, config);
        setTimeout(() => setLoading(false), 100);
        // setLoading(false);
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
        const response = await axios.delete(prependBaseUrl(path), config);
        setLoading(false);
        return response;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    },
    getFile: async (
      path: string,
      config: AxiosRequestConfig = {}
    ): Promise<AxiosResponse | void> => {
      setLoading(true);
      setError("");
      config.headers = { ...getAuthHeader().headers, ...config.headers };
      try {
        const response = await axios.get(prependBaseUrl(path), {
          responseType: "blob",
          ...config,
        });
        setLoading(false);
        return response;
      } catch (error) {
        return handleError(error as AxiosError);
      }
    }
  };
};

export default useHttp;
