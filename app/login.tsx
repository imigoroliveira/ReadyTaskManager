import { useAuth } from "@/hooks/checkToken";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Image, StyleSheet, TextInput, View } from "react-native";
import { saveToken } from "../hooks/tokenStorage";
export default function Login() {
  const router = useRouter();
  useAuth();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  function handleLogin() {
    validaLoginSenha()
      .then((isValid) => {
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
      })
      .catch(() => {
        alert("Erro na validação!");
      });
  }

  function validaLoginSenha() {
    return new Promise((resolve) => {
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
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.image}
      />
      <TextInput
        placeholder="Login"
        style={styles.input}
        onChangeText={setLogin}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        style={styles.input}
        onChangeText={setSenha}
      />

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: 500,
    height: 150,
    marginTop: -100,
    alignSelf: "center",
    marginBottom: "30%",
  },
});
