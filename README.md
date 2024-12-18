# teste-ppdmo

## Objetivo
- Criar um projeto no Firebase
- Configurar o projeto utilizando Expo

## Criando Projeto no Expo

1. Crie um projeto com o Expo
```bash 
npx create-expo-app petshop --template blank
```
2. Acesse o diretório do projeto
```bash
cd petshop
```
3. Instale o pacote do Firebase
```bash
npm install firebase
```
## Firebase
1. Acesse o site do [Firebase](https://firebase.google.com/)
2. Crie um projeto chamado Petshop
![alt text](image.png)
3. Insira o nome do projeto e clique em continuar
![alt text](image-1.png)
4. Neste caso desativo o analytics
![alt text](image-2.png)
5. Ele vai gerar o codigo para consumir o banco no aplicativo
![alt text](image-3.png)
5. Instale o pacote do Firebase no projeto
```bash
npm install firebase
```

Dentro do seu projeto no Firebase clique na opção

![alt text](image-4.png)

Adicione um banco de dados Firestore

dentro desta opção vamos definir as regras de acesso ao banco de dados

![alt text](image-5.png)

Vamos definir a seguinte regra
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
Com o codigo feito utilizar o comando
```bash 
yarn run web
```

Quando der o erro Metro Builder, executar
```bash
yarn add react-native-web react-dom @expo/metro-runtime
```

---

## Instalando dependencias

Inicialmente vamos instalar alguma dependencias para poder armazenar juntamente com os dados as imagens dos animais

```bash
yarn add react-native-image-picker
yarn add @react-native-firebase/storage
yarn add react-native-vector-icons

Dentro do arquivo firebaseconfig.js adicione a seguinte configuração

```javascript
import { getStorage } from 'firebase/storage';
```

E tamebem ao final do arquivo adicione a seguinte configuração

```javascript
export const storage = getStorage();
```
Va em seu arquivo App.js e vamos adicionar as alterações de storage e o CRUD juntos

