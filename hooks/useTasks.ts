import { useEffect, useState } from "react";
import { getToken } from "../hooks/tokenStorage";

export type TaskType = "toDo" | "shopping" | "normal" | "event";

export type Task = {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
};

const API_BASE_URL = "http://localhost:5023/api";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function loadToken() {
      try {
        const storedToken = await getToken();
        console.log("Token carregado:", storedToken);
        setToken(storedToken);
      } catch (err) {
        console.error("Erro ao carregar token:", err);
        setError("Erro ao carregar token");
        setLoading(false);
      }
    }

    loadToken();
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetchTasks(token);
  }, [token]);

  async function fetchTasks(tokenParam: string) {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/Task`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenParam}`,
        },
      });

      console.log("STATUS:", response.status);

      if (!response.ok) {
        throw new Error(`Erro ao buscar tarefas: ${response.status}`);
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro ao buscar tarefas:", err);
    } finally {
      setLoading(false);
    }
  }

  async function createTask(taskData: Omit<Task, "id">) {
    if (!token) throw new Error("Token não encontrado");

    const response = await fetch(`${API_BASE_URL}/task`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar tarefa: ${response.status}`);
    }

    const newTask = await response.json();
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }

  async function updateTask(id: string, taskData: Omit<Task, "id">) {
    if (!token) throw new Error("Token não encontrado");

    const response = await fetch(`${API_BASE_URL}/task/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar tarefa: ${response.status}`);
    }

    const updatedTask = await response.json();
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task)),
    );

    return updatedTask;
  }

  async function deleteTask(id: string) {
    if (!token) throw new Error("Token não encontrado");

    const response = await fetch(`${API_BASE_URL}/task/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao deletar tarefa: ${response.status}`);
    }

    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  return {
    tasks,
    loading,
    error,
    refetch: () => token && fetchTasks(token),
    createTask,
    updateTask,
    deleteTask,
  };
}
