import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SideMenuProps = {
  visible: boolean;
  onClose: () => void;
  onNavigate: (path: "/home" | "/login") => void;
};

export default function SideMenu({
  visible,
  onClose,
  onNavigate,
}: SideMenuProps) {
  function handleNavigate(path: "/home" | "/login") {
    onNavigate(path);
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.drawer} onPress={() => undefined}>
          <Text style={styles.title}>Menu</Text>

          <TouchableOpacity
            style={styles.item}
            onPress={() => handleNavigate("/home")}
          >
            <Text style={styles.itemText}>Início</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => handleNavigate("/home")}
          >
            <Text style={styles.itemText}>Minhas Tarefas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => handleNavigate("/login")}
          >
            <Text style={styles.itemText}>Sair</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.section}>Ajuda</Text>
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleNavigate("/home")}
          >
            <Text style={styles.itemText}>Como usar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleNavigate("/home")}
          >
            <Text style={styles.itemText}>Preferências</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Ready Task Manager</Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  drawer: {
    width: 280,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 40,
    minHeight: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
  },
  section: {
    marginTop: 24,
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginBottom: 8,
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ececec",
  },
  itemText: {
    fontSize: 16,
    color: "#222",
  },
  divider: {
    height: 1,
    backgroundColor: "#ececec",
    marginVertical: 16,
  },
  footer: {
    marginTop: 40,
  },
  footerText: {
    color: "#888",
    fontSize: 12,
  },
});
