import { useState, useEffect } from 'react';
import { apiClient } from '../api/config';

export interface Tutorial {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  transcript: string;
  videoUrl?: string;
}

interface PaginationData { data: Tutorial[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const useTutorials = (page: number = 1, limit: number = 10) => {
  const [data, setData] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/tutorials?page=${page}&limit=${limit}`);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error loading tutorials');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, [page, limit]);

  return { data, loading, error };
};

export const useTutorialDetail = (id: number | null) => {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setTutorial(null);
      setLoading(false);
      return;
    }

    const fetchTutorial = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/tutorials/${id}`);
        setTutorial(response.data.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error loading tutorial');
        setTutorial(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorial();
  }, [id]);

  return { tutorial, loading, error };
};
