import { useState, useEffect } from "react";
import { getAllJobs } from "../services/api";

function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getAllJobs();

      // API might return data in different shapes
      // This handles all cases
      const data = Array.isArray(res.data) ? res.data : [];
      setJobs(data);
    } catch (err) {
      setError("Failed to load jobs");
      setJobs([]); // Set empty array on error so .map() doesn't break
    } finally {
      setLoading(false);
    }
  };

  const addJob = (job) => setJobs((prev) => [job, ...prev]);

  const editJob = (updated) =>
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));

  const removeJob = (id) => setJobs((prev) => prev.filter((j) => j.id !== id));

  return { jobs, loading, error, addJob, editJob, removeJob };
}

export default useJobs;
