import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  PanResponder,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Task, useTasks } from "../../hooks/useTasks";

const taskTypeLabels = {
  toDo: "To do",
  shopping: "Compras",
  normal: "Normal",
  event: "Evento",
};

export default function TaskEdit() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { tasks, updateTask, createTask } = useTasks();

  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<any>("toDo");

  useEffect(() => {
    if (isEdit) {
      const found = tasks.find((t: Task) => t.id == id);
      if (found) {
        setTitle(found.title);
        setDescription(found.description);
        setType(found.type);
      }
    }
  }, [id, tasks]);

  async function handleSave() {
    const data = { title, description, type };

    if (isEdit) {
      await updateTask(Number(id), data);
    } else {
      await createTask(data);
    }

    router.back();
  }

  // 🚀 SWIPE BACK (ESQUERDA → DIREITA)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > 20;
      },

      onPanResponderRelease: (_, gesture) => {
        // swipe da esquerda pra direita
        if (gesture.dx > 80 && Math.abs(gesture.dy) < 50) {
          router.back();
        }
      },
    }),
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Text style={styles.header}>
        {isEdit ? "Editar tarefa" : "Nova tarefa"}
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Título</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textArea]}
          multiline
        />

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typeRow}>
          {Object.entries(taskTypeLabels).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setType(key)}
              style={[
                styles.typeButton,
                type === key && styles.typeButtonActive,
              ]}
            >
              <Text
                style={[styles.typeText, type === key && styles.typeTextActive]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancel}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
    padding: 20,
  },

  header: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6b7280",
    marginTop: 10,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 10,
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },

  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f3f4f6",
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },

  typeButtonActive: {
    backgroundColor: "#2563eb",
  },

  typeText: {
    fontSize: 13,
    color: "#374151",
  },

  typeTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  saveButton: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "800",
  },

  cancel: {
    marginTop: 12,
    textAlign: "center",
    color: "#6b7280",
  },
});
