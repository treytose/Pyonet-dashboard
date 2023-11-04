import { useContext, useState, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { AuthContext } from "../contexts/AuthContext";

interface Props {
  pollerid?: number | string | undefined;
}

const usePollerHttp = ({ pollerid }: Props) => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [setPollerid] = useState(pollerid);

  const getAuthHeader = () => {
    return authCtx.token ? { Authorization: `Bearer ${authCtx.token}` } : {};
  };

  const queryPoller = async (route: string, method: string, params: AxiosRequestConfig = {}, body: any = {}) => {
    setLoading(true);
    setError("");

    const headers = getAuthHeader();
    const pollerRoute = "/api/query-poller";

    try {
      const response = await axios.post(pollerRoute, {
        pollerid,
        route,
        method,
        params,
        body
      }, { headers });

      setLoading(false);
      return response;
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      setError(err.response?.data?.detail || err.message);
      return err.response;
    }
  };

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  // Return functions that use queryPoller with the method specified
  return {
    error,
    loading,
    get: (path: string, config: AxiosRequestConfig = {}) => queryPoller(path, 'GET', config.params || {}),
    post: (path: string, data = {}, config: AxiosRequestConfig = {}) => queryPoller(path, 'POST', config.params || {}, data),
    put: (path: string, data = {}, config: AxiosRequestConfig = {}) => queryPoller(path, 'PUT', config.params || {}, data),
    delete: (path: string, config: AxiosRequestConfig = {}) => queryPoller(path, 'DELETE', config.params || {}),
    setPollerid,
  };
};

export default usePollerHttp;
