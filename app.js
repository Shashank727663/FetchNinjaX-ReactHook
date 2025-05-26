import { useEffect, useRef, useState } from "react";

const cacheStore = new Map();

function useSmartFetch(url, options = {}) {
  const {
    method = "GET",
    headers = {},
    body = null,
    timeout = 10000,
    retry = 0,
    retryDelay = attempt => Math.min(1000 * 2 ** attempt, 10000),
    refreshInterval = null,
    cache = false,
    cacheTime = 60000,
    onSuccess,
    onError,
    customFetcher
  } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchData = async (attempt = 0) => {
    setLoading(true);
    setError(null);

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    const cached = cacheStore.get(url);
    if (cache && cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    try {
      let responseData;

      if (customFetcher) {
        responseData = await customFetcher();
      } else {
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        responseData = await response.json();
      }

      if (cache) {
        cacheStore.set(url, {
          data: responseData,
          timestamp: Date.now()
        });
      }

      setData(responseData);
      onSuccess && onSuccess(responseData);
    } catch (err) {
      if (err.name === "AbortError") return;

      if (attempt < retry) {
        setTimeout(() => fetchData(attempt + 1), retryDelay(attempt));
        return;
      }

      setError(err);
      onError && onError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (refreshInterval) {
      intervalRef.current = setInterval(fetchData, refreshInterval);
    }

    return () => {
      controllerRef.current?.abort();
      clearInterval(intervalRef.current);
    };
  }, [url]);

  return { data, error, loading };
}

export default useSmartFetch;
