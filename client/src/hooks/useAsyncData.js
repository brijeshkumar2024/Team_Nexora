import { useEffect, useState } from "react";

export const useAsyncData = (fetcher, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    fetcher()
      .then((result) => {
        if (alive) setData(result);
      })
      .catch((err) => {
        if (alive) setError(err?.response?.data?.message || "Something went wrong");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, setData };
};
