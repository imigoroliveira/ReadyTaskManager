import React from "react";
import {
  Button,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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

type TaskModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id">) => void;
  editingTask?: Task | null;
};

export default function TaskModal({
  visible,
  onClose,
  onSave,
  editingTask,
}: TaskModalProps) {
  const [title, setTitle] = React.useState(editingTask?.title || "");
  const [description, setDescription] = React.useState(
    editingTask?.description || "",
  );
  const [taskType, setTaskType] = React.useState<TaskType>(
    editingTask?.type || "toDo",
  );

  React.useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setTaskType(editingTask.type);
    } else {
      setTitle("");
      setDescription("");
      setTaskType("toDo");
    }
  }, [editingTask]);

  function handleSave() {
    if (!title.trim()) {
      alert("Informe um título para a tarefa.");
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      type: taskType,
    });

    onClose();
  }

  function handleAgenda() {
    alert("Evento adicionado à agenda com sucesso!");
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <KeyboardAvoidingView
          style={styles.modalWrapper}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable style={styles.modalContent} onPress={() => undefined}>
            <Text style={styles.modalTitle}>
              {editingTask ? "Editar tarefa" : "Nova tarefa"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Título"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text style={styles.label}>Tipo de tarefa</Text>
            <View style={styles.typeRow}>
              {Object.entries(taskTypeLabels).map(([key, label]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.typeButton,
                    taskType === key ? styles.typeButtonActive : null,
                  ]}
                  onPress={() => setTaskType(key as TaskType)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      taskType === key ? styles.typeButtonTextActive : null,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {taskType === "event" ? (
              <View style={styles.agendaContainer}>
                <Text style={styles.agendaText}>
                  Este é um evento. Você pode adicioná-lo à agenda.
                </Text>
                <Button title="Adicionar à agenda" onPress={handleAgenda} />
              </View>
            ) : null}

            <View style={styles.modalActions}>
              <Button title="Salvar" onPress={handleSave} />
              <View style={styles.spacer} />
              <Button title="Cancelar" color="#888" onPress={onClose} />
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalWrapper: {
    width: "100%",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 420,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  label: {
    marginBottom: 8,
    color: "#374151",
    fontWeight: "700",
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
    marginBottom: 8,
    marginRight: 8,
  },
  typeButtonActive: {
    backgroundColor: "#4338ca",
  },
  typeButtonText: {
    color: "#1f2937",
    fontSize: 13,
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  agendaContainer: {
    marginBottom: 20,
  },
  agendaText: {
    marginBottom: 10,
    color: "#111827",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  spacer: {
    width: 12,
  },
});
