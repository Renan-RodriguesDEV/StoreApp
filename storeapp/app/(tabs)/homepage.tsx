import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "@/constants/venvs";
type Product = {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  descricao: string;
  imagem: string | null;
  fk_vendedor: number;
};

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const [id, setId] = useState<number>(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const sidebarWidth = sidebarExpanded ? 150 : 50;

  useEffect(() => {
    const loadData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/");
        return;
      }
      const userTypeValue = await AsyncStorage.getItem("userType");
      setUserEmail(await AsyncStorage.getItem("user"))
      setUserType(userTypeValue ? userTypeValue.replace(/"/g, "") : null);

      const idValue = await AsyncStorage.getItem("id");
      setId(idValue ? parseInt(idValue) : 0);

      try {
        const response =
          userTypeValue === "clientes"
            ? await axios.get(`${API_URL}/product`)
            : await axios.get(`${API_URL}/product/seller/${idValue}`);

        setProducts(response.data.products);
      } catch (err) {
        alert("Erro ao carregar produtos");
      }
    };
    loadData();
  }, []);

  function logout() {
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("userType");
    AsyncStorage.removeItem("id");
    router.replace("/");
  }

  function handleEditUser(id: number) {
    router.push({
      pathname: "/(tabs)/edit_user",
      params: { id: id.toString() },
    });
  }

  function handleBuy(id: number) {
    router.push({ pathname: "/(tabs)/buy", params: { id: id.toString() } });
  }

  function handleAddProduct() {
    router.push("/(tabs)/register_product");
  }

  function handleEditProduct(id: number) {
    router.push({
      pathname: "/(tabs)/edit_product",
      params: { id: id.toString() },
    });
  }

  return (
    <View style={styles.mainContainer}>
      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          sidebarExpanded ? styles.sidebarExpanded : styles.sidebarCollapsed,
          { width: sidebarWidth },
        ]}
      >
        {/* Sidebar Toggle Button */}
        <TouchableOpacity
          style={styles.sidebarToggle}
          onPress={() => setSidebarExpanded((prev) => !prev)}
        >
          <Ionicons
            name={
              sidebarExpanded
                ? "chevron-back-outline"
                : "chevron-forward-outline"
            }
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
        {/* Show buttons only if expanded */}
        {sidebarExpanded && (
          <View
            style={{
              flex: 1,
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ width: "100%", alignItems: "center" }}>
              <TouchableOpacity
                style={[styles.sidebarButton, { marginTop: 10 }]}
                onPress={() => handleEditUser(id)}
              >
                <Text style={styles.sidebarButtonText}>Editar Perfil</Text>
              </TouchableOpacity>
              {userType === "clientes" && (
                <TouchableOpacity
                  style={styles.sidebarButton}
                  onPress={() => router.push("/(tabs)/my_purchases")}
                >
                  <Text style={styles.sidebarButtonText}>Minhas Compras</Text>
                </TouchableOpacity>
              )}
              {userType === "vendedores" && (
                <TouchableOpacity
                  style={styles.sidebarButton}
                  onPress={handleAddProduct}
                >
                  <Text style={styles.sidebarButtonText}>
                    Adicionar Produto
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.sidebarLogoutContainer}>
              <TouchableOpacity style={styles.sidebarButton} onPress={logout}>
                <Text style={styles.sidebarButtonTextLogout}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Main Content */}
      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            Bem-vindo ao StoreApp
            {userEmail ? `, ${userEmail.replace(/"/g, "")}` : ""}!
          </Text>
          {userType === "vendedores" && (
            <Text style={styles.intuitiveText}>
              Adicione produtos para começar a vender!
            </Text>
          )}
        </View>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              <Text style={styles.productName}>{item.nome}</Text>
              <Text style={styles.productInfo}>Preço: R$ {item.preco}</Text>
              <Text style={styles.productInfo}>
                Descrição: {item.descricao}
              </Text>
              <Text style={styles.productInfo}>
                Quantidade: {item.quantidade}
              </Text>
              {item.imagem && (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${item.imagem}` }}
                  style={{ width: 100, height: 100, marginTop: 10 }}
                />
              )}

              {/* Botões de ação para vendedores ou clientes */}
              {userType === "vendedores" ? (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditProduct(item.id)}
                >
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
              ) : userType === "clientes" ? (
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => handleBuy(item.id)}
                >
                  <Text style={styles.buttonText}>Comprar</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#181818",
  },
  sidebar: {
    backgroundColor: "#232323",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    position: "relative",
  },
  sidebarCollapsed: {
    width: 50,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 0,
  },
  sidebarExpanded: {
    width: 150,
    alignItems: "center",
    paddingHorizontal: 0,
    flex: 1,
  },
  sidebarToggle: {
    padding: 5,
    borderRadius: 4,
    marginBottom: 5,
    alignItems: "center",
    width: 40,
  },
  sidebarButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: "90%",
    backgroundColor: "#ff0202",
    alignItems: "center",
  },
  sidebarButtonText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  sidebarButtonTextLogout: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  sidebarLogoutContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  listContent: {
    paddingBottom: 20,
  },
  productContainer: {
    backgroundColor: "#232323",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  productName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productInfo: {
    color: "#ccc",
    fontSize: 15,
    marginBottom: 4,
  },
  editButton: {
    backgroundColor: "#FF8C00",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buyButton: {
    backgroundColor: "#2ecc71",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 10,
  },

  welcomeText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  intuitiveText: {
    color: "#FF8C00",
    fontSize: 18,
    textAlign: "center",
    marginTop: 4,
    fontWeight: "600",
  },
});
