import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTasks, type Task } from "../hooks/useTasks";
import Header from "./components/Header";
import HeroCard from "./components/HeroCard";
import SideMenu from "./components/SideMenu";
import TaskCard from "./components/TaskCard";
import TaskModal from "./task/view";

export default function Home() {
  const router = useRouter();
  const { tasks, loading, error, createTask, updateTask } = useTasks();

  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  function openTask(task: Task) {
    router.push({
      pathname: "/task/view",
      params: { id: task.id },
    });
  }

  function openCreate() {
    setActiveTask(null);
    setModalOpen(true);
  }

  async function handleSaveTask(taskData: Omit<Task, "id">) {
    try {
      if (activeTask) {
        await updateTask(activeTask.id, taskData);
      } else {
        await createTask(taskData);
      }
    } catch {
      alert("Erro ao salvar tarefa");
    }
  }

  function handleLogout() {
    router.replace("/login");
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Erro: {error}</Text>
        <Button title="Recarregar" onPress={() => window.location.reload()} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SideMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={(path) => router.push(path)}
      />

      <Header
        onMenuPress={() => setMenuOpen(true)}
        onLogoutPress={handleLogout}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <HeroCard />

        <Button title="Nova tarefa" onPress={openCreate} />

        <Text style={styles.title}>Tarefas</Text>

        {tasks.length === 0 ? (
          <Text>Nenhuma tarefa</Text>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onPress={openTask} />
          ))
        )}
      </ScrollView>

      <TaskModal
        visible={modalOpen}
        task={activeTask}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f6f7fb" },
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 18, fontWeight: "700", marginVertical: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
