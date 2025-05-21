import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { View, Text, Button, StyleSheet, Alert, TextInput } from "react-native";
// import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function App() {
  const [userEmail, setUserEmail] = useState("");
  const [userType, setUserType] = useState("clientes");
  const [password, setPassword] = useState("");
  // const urlAPI = "http://192.168.1.9:5001"; // url para PC
  // const urlAPI = "http://192.168.1.18:5001"; // url para notebook
  const urlAPI = "http://192.168.198.16:5001"; // url para notebook
  const router = useRouter();
  async function saveUser(token: string, id: number) {
    // Salva o token e o email do usuário no AsyncStorage
    await AsyncStorage.setItem("user", JSON.stringify(userEmail));
    await AsyncStorage.setItem("token", JSON.stringify(token));
    await AsyncStorage.setItem("userType", userType);
    await AsyncStorage.setItem("id", JSON.stringify(id));
  }
  const authLogin = () => {
    axios
      .post(`${urlAPI}/user/login?type_user=${userType}`, {
        email: userEmail,
        password: password,
      })
      .then((response) => {
        if (response.data.message === "sucess") {
          saveUser(response.data.token, response.data.id);
          router.push("/(tabs)/homepage");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Erro ao fazer login Credenciais invalidas");
        Alert.alert("Erro ao fazer login", "Credenciais invalidas");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.label}>Tipo de usuário:</Text>
      <Picker
        selectedValue={userType}
        style={styles.picker}
        onValueChange={(itemValue) => setUserType(itemValue)}
      >
        <Picker.Item label="Cliente" value="clientes" />
        <Picker.Item label="Vendedor" value="vendedores" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={userEmail}
        onChangeText={setUserEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />
      <View style={styles.buttonRow}>
        <View style={styles.buttonContainer}>
          <Button title="Entrar" onPress={authLogin} color="#4F8EF7" />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Registrar-se"
            onPress={() => router.push("/(tabs)/register_user")}
            color="green"
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#181A20",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  label: {
    marginBottom: 5,
    color: "#fff",
  },
  picker: {
    height: 50,
    marginBottom: 10,
    color: "#fff",
    backgroundColor: "#23242a",
  },
  input: {
    borderColor: "#333",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    color: "#fff",
    backgroundColor: "#23242a",
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonContainer: {
    flex: 1,
    marginHorizontal: 5,
    maxWidth: 130,
  },
});
