import { StyleSheet, Text, View } from "react-native";

export default function HeroCard() {
  return (
    <View style={styles.heroCard}>
      <Text style={styles.heroTitle}>
        Gerencie suas tarefas com flexibilidade
      </Text>
      <Text style={styles.heroDescription}>
        Crie tarefas normais, listas de compras, to do lists e eventos. Abra o
        modal para criar ou editar uma tarefa existente.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  heroDescription: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
});
