import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
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

const taskTypeColors = {
  toDo: "#2563eb",
  shopping: "#16a34a",
  normal: "#6b7280",
  event: "#f59e0b",
};

export default function TaskView() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { tasks } = useTasks();

  const task = tasks.find((t: Task) => t.id == id);

  const translateY = useRef(new Animated.Value(0)).current;

  function close() {
    Animated.timing(translateY, {
      toValue: 1000,
      duration: 200,
      useNativeDriver: true,
    }).start(() => router.back());
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => {
        return Math.abs(g.dx) > 10 || Math.abs(g.dy) > 10;
      },

      onPanResponderMove: (_, g) => {
        // 🔽 SWIPE VERTICAL (baixar sheet)
        if (g.dy > 0 && Math.abs(g.dy) > Math.abs(g.dx)) {
          translateY.setValue(g.dy);
        }
      },

      onPanResponderRelease: (_, g) => {
        const isVertical = Math.abs(g.dy) > Math.abs(g.dx);

        // 🔽 SWIPE PARA BAIXO → FECHAR
        if (isVertical && g.dy > 120) {
          close();
          return;
        }

        // ↩️ SWIPE ESQUERDA → DIREITA → VOLTAR
        if (!isVertical && g.dx > 80) {
          router.back();
          return;
        }

        // 🔄 VOLTA PRA POSIÇÃO NORMAL
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  if (!task) {
    return (
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text>Tarefa não encontrada</Text>
        </View>
      </View>
    );
  }

  const typeColor = taskTypeColors[task.type];

  function handleEdit() {
    router.push({
      pathname: "/task/edit",
      params: { id: task.id },
    });
  }

  return (
    <View style={styles.backdrop}>
      <Animated.View
        style={[styles.sheet, { transform: [{ translateY }] }]}
        {...panResponder.panHandlers}
      >
        {/* HANDLE */}
        <View style={styles.handle} />

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>{task.title}</Text>

          <View style={[styles.badge, { backgroundColor: typeColor }]}>
            <Text style={styles.badgeText}>{taskTypeLabels[task.type]}</Text>
          </View>
        </View>

        {/* DESCRIPTION CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Descrição</Text>
          <Text style={styles.text}>{task.description || "Sem descrição"}</Text>
        </View>

        {/* TYPE CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Tipo da tarefa</Text>
          <Text style={[styles.typeText, { color: typeColor }]}>
            {taskTypeLabels[task.type]}
          </Text>
        </View>

        {/* ACTION */}
        <TouchableOpacity style={styles.button} onPress={handleEdit}>
          <Text style={styles.buttonText}>Editar tarefa</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={close}>
          <Text style={styles.back}>Fechar</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  sheet: {
    height: "90%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#d1d5db",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 15,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
    color: "#111827",
  },

  badge: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#f9fafb",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6b7280",
    marginBottom: 6,
  },

  text: {
    fontSize: 15,
    color: "#111827",
  },

  typeText: {
    fontSize: 16,
    fontWeight: "700",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  back: {
    marginTop: 15,
    textAlign: "center",
    color: "#6b7280",
  },
});
