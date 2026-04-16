import { Pressable, StyleSheet, Text, View } from "react-native";

type TaskType = "toDo" | "shopping" | "normal" | "event";

type Task = {
  id: string;
  title: string;
  description: string;
  type: TaskType;
};

const taskTypeLabels: Record<TaskType, string> = {
  toDo: "To do list",
  shopping: "Lista de compras",
  normal: "Tarefa normal",
  event: "Evento",
};

type TaskCardProps = {
  task: Task;
  onPress: (task: Task) => void;
};

export default function TaskCard({ task, onPress }: TaskCardProps) {
  return (
    <Pressable
      key={task.id}
      style={styles.taskCard}
      onPress={() => onPress(task)}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{taskTypeLabels[task.type]}</Text>
        </View>
      </View>
      <Text style={styles.taskDescription}>{task.description}</Text>
      {task.type === "event" ? (
        <View style={styles.eventRow}>
          <Text style={styles.eventText}>
            Evento: toque para editar e adicionar à agenda
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  typeBadge: {
    backgroundColor: "#eef2ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    color: "#4338ca",
    fontSize: 12,
    fontWeight: "700",
  },
  taskDescription: {
    color: "#4b5563",
    fontSize: 14,
    lineHeight: 20,
  },
  eventRow: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
  eventText: {
    color: "#2563eb",
    fontSize: 13,
  },
});
