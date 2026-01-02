import { useState, useEffect } from 'react';

export interface ConfigValue {
  id: number;
  key: string;
  value: string;
  description?: string;
  data_type?: string;
  updated_at?: string;
}

export function useConfig(configKey?: string) {
  const [config, setConfig] = useState<ConfigValue | ConfigValue[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, [configKey]);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const url = configKey ? `/api/config?key=${configKey}` : '/api/config';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (key: string, value: string, description?: string, data_type?: string) => {
    try {
      const response = await fetch(`/api/config?key=${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, description, data_type }),
      });
      const data = await response.json();
      if (response.ok) {
        await fetchConfig();
        return { success: true, data };
      }
      return { success: false, error: data.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const createConfig = async (key: string, value: string, description?: string, data_type?: string) => {
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, description, data_type }),
      });
      const data = await response.json();
      if (response.ok) {
        await fetchConfig();
        return { success: true, data };
      }
      return { success: false, error: data.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const deleteConfig = async (key: string) => {
    try {
      const response = await fetch(`/api/config?key=${key}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        await fetchConfig();
        return { success: true, data };
      }
      return { success: false, error: data.error };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    config,
    loading,
    updateConfig,
    createConfig,
    deleteConfig,
    refetch: fetchConfig,
  };
}
