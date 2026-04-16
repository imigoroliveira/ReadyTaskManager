import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTasks, type Task } from "../hooks/useTasks";
import Header from "./components/Header";
import HeroCard from "./components/HeroCard";
import SideMenu from "./components/SideMenu";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";

export default function Home() {
  const router = useRouter();
  const { tasks, loading, error, createTask, updateTask } = useTasks();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  function openCreateModal() {
    setActiveTask(null);
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setActiveTask(task);
    setModalOpen(true);
  }

  async function handleSaveTask(taskData: Omit<Task, "id">) {
    try {
      if (activeTask) {
        await updateTask(activeTask.id, taskData);
      } else {
        await createTask(taskData);
      }
    } catch (err) {
      alert("Erro ao salvar tarefa. Tente novamente.");
    }
  }

  function handleLogout() {
    router.replace("/login");
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando tarefas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro: {error}</Text>
        <Button
          title="Tentar novamente"
          onPress={() => window.location.reload()}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={(path) => {
          if (path === "/login") {
            router.replace(path);
          } else {
            router.push(path);
          }
        }}
      />

      <Header
        onMenuPress={() => setMenuOpen(true)}
        onLogoutPress={handleLogout}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <HeroCard />

        <Button title="Nova tarefa" onPress={openCreateModal} />

        <Text style={styles.sectionTitle}>Tarefas</Text>
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma tarefa cadastrada.</Text>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onPress={openEditModal} />
          ))
        )}
      </ScrollView>

      <TaskModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        editingTask={activeTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 16,
  },
  emptyText: {
    color: "#6b7280",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
});
