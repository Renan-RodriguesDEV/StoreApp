# StoreApp

Autor: [Renan-RodriguesDEV](https://github.com/Renan-RodriguesDEV)

Este projeto é um sistema completo de loja, composto por um backend em Python (Flask) e um frontend mobile em React Native utilizando Expo.

## Estrutura do Projeto

- **backend/**: API em Flask para gerenciamento de usuários, produtos e compras.
- **storeapp/**: Aplicativo mobile feito com React Native + Expo Router.

## Pré-requisitos

- Node.js (recomendado: versão 18+)
- npm ou yarn
- Python 3.10+
- MySQL Server
- Expo CLI (global):

  ```bash
  npm install -g expo-cli
  ```

## Instalação

### 1. Backend

```bash
cd backend
pip install flask flask-cors pymysql
```

### 2. Frontend

```bash
cd storeapp
npm install
```

### 3. Instalação de Dependências Adicionais no Frontend

Para utilizar recursos como câmera, armazenamento assíncrono e seleção de imagens, instale os seguintes pacotes:

```bash
# Expo Camera
npx expo install expo-camera

# Async Storage
npx expo install @react-native-async-storage/async-storage

# React Picker
npm install @react-native-picker/picker

# Axios
npm install axios
```

> **Observação:** O pacote correto para seleção de imagens é o `expo-image-picker`, contudo não funciona pra mim.

## Como rodar o projeto

- Inicie o backend:
  ```bash
  cd backend
  python app.py
  ```
- Inicie o frontend:
  ```bash
  cd storeapp
  npm start
  ```

## Licença

Este projeto está licenciado sob os termos da licença MIT.
