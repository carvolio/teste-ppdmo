import { StatusBar } from 'expo-status-bar';
import React, {useState} from "react";
import { StyleSheet, Text, View, Button, TextInput, FlatList, Image } from 'react-native';
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import { collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVnjk5V27MkFE2wwGIgqNZyKZ2VF8B_as",
  authDomain: "petshop-aa2e8.firebaseapp.com",
  projectId: "petshop-aa2e8",
  storageBucket: "petshop-aa2e8.firebasestorage.app",
  messagingSenderId: "68502119888",
  appId: "1:68502119888:web:1222b76c0966168601c5d5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default function App() {
    const [nomePet, setNomePet] = useState("");
    const [tipoPet, setTipoPet] = useState("");
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(false);
    
  const adicionarPet = async () => {
      try {
        setLoading(true);
        await addDoc(collection(db,"pets"),{
          nome: nomePet,
          tipo: tipoPet
        });
        alert("Pet adicionado com sucesso!");
        setNomePet('');
        setTipoPet('');
        fetchPets();
      }catch (e) {
        console.error("Erro ao adicionar pet", e);
      }finally {
        setLoading(false);
      }
    };
    
  const fetchPets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pets"));
        const petslist = querySnapshot.docs.map(doc => doc.data());
        setPets(petslist);
        } catch (e) {
          console.error("Erro ao buscar pets", e);
        }
    };

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Pets SENAI</Text>

    <Text style={styles.label}>Nome do Pet</Text>
    <TextInput
    style={styles.input}
    placeholder="Digite o nome do pet"
    value={nomePet}
    onChangeText={setNomePet}
    />

    <Text style={styles.label}>Tipo do Pet</Text>
    <TextInput
    style={styles.input}
    placeholder="Digite o tipo do pet"
    value={tipoPet}
    onChangeText={setTipoPet}
    />
    <Button
    title={loading? "Adicionando..." : "Adicionar Pet"}
    onPress={adicionarPet}
    color="#6b8e23"
    />

    <Text style={styles.label}>Lista de Pets</Text>
    <FlatList
    data={pets}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({item}) => (
      <View style={styles.petItem}>
        <Image
        source={{uri: 'https://via.placeholder.com/100'}}
        style={styles.petImage}
        />
      <View>
      <Text style={styles.petName}>{item.nome}</Text>
      <Text style={styles.petType}>{item.tipo}</Text>
      </View>
    </View>
    )}
    style={styles.petList}
    />
    </View>
    
  );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
