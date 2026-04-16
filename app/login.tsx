import { useAuth } from "@/hooks/checkToken";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { saveToken } from "../hooks/tokenStorage";

export default function Login() {
  const router = useRouter();
  useAuth();

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin() {
    validaLoginSenha().then((isValid) => {
      if (isValid) {
        fetch("http://localhost:5023/api/Auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login, senha }),
        })
          .then(async (response) => {
            if (response.ok) {
              const data = await response.json();
              await saveToken(data.token);
              router.push("/home");
            } else {
              alert("Login ou senha inválidos!");
            }
          })
          .catch((error) => {
            console.error("Erro ao conectar com o servidor", error);
            alert(error);
          });
      }
    });
  }

  function validaLoginSenha() {
    return new Promise<boolean>((resolve) => {
      if (login.trim() === "" || senha.trim() === "") {
        alert("Login e senha são obrigatórios!");
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.image}
        />

        <Text style={styles.title}>Bem-vindo</Text>
        <Text style={styles.subtitle}>Faça login para continuar</Text>

        <TextInput
          placeholder="Usuário ou E-mail"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          onChangeText={setLogin}
        />

        <TextInput
          placeholder="Senha"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          style={styles.input}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  image: {
    width: 160,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
    resizeMode: "contain",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    color: "#111827",
  },

  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
