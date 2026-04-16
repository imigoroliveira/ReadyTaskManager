import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type HeaderProps = {
  onMenuPress: () => void;
  onLogoutPress: () => void;
};

export default function Header({ onMenuPress, onLogoutPress }: HeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.menuTrigger} onPress={onMenuPress}>
        <Text style={styles.menuTriggerText}>☰</Text>
      </TouchableOpacity>

      <Text style={styles.pageTitle}>Minhas tarefas</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingTop: Platform.OS === "ios" ? 50 : 24,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  menuTrigger: {
    padding: 10,
  },
  menuTriggerText: {
    fontSize: 24,
    fontWeight: "700",
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  logoutButton: {
    padding: 10,
  },
  logoutText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
