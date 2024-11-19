import React, {useState} from "react";
import { StyleSheet, Text, View, Button, TextInput, FlatList, Image } from 'react-native';
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';

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

const petIcons = ['paw', 'bug', 'heart', 'star', 'leaf', 'fish'];

export default function App() {
    const [nomePet, setNomePet] = useState("");
    const [tipoPet, setTipoPet] = useState("");
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingPetId, setEditingPetId] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    
    const selecionarImagem = () => {
      launchImageLibrary({ mediaType: 'photo' }, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.error('ImagePicker Error: ', response.error);
        } else {
          setImageUri(response.assets[0].uri);
        }
      });
    };
  
    const uploadImage = async () => {
      if (!imageUrl) return null;
  
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `pets/${filename}`);
      
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    };
  
    const adicionarOuAtualizarPet = async () => {
      try {
        setLoading(true);
        const imageUrl = await uploadImage();
  
        if (editingPetId) {
          const petRef = doc(db, 'pets', editingPetId);
          await updateDoc(petRef, {
            nome: nomePet,
            tipo: tipoPet,
            imageUrl: imageUrl || null
          });
          alert('Pet atualizado com sucesso!');
          setEditingPetId(null);
        } else {
          await addDoc(collection(db, 'pets'), {
            nome: nomePet,
            tipo: tipoPet,
            icon: petIcons[Math.floor(Math.random() * petIcons.length)],
            imageUrl: imageUrl || null
          });
          alert('Pet adicionado com sucesso!');
        }
  
        setNomePet('');
        setTipoPet('');
        setImageUri(null);
        fetchPets();
      } catch (e) {
        console.error("Erro ao salvar pet: ", e);
      } finally {
        setLoading(false);
      }
    };
    
  const fetchPets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pets"));
        const petslist = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setPets(petslist);
        } catch (e) {
          console.error("Erro ao buscar pets", e);
        }
    };

    const editarPet = (pet) => {
      setNomePet(pet.nome);
      setTipoPet(pet.tipo);
      setImageUri(pet.imageUrl);
      setEditingPetId(pet.id);
    };

    const excluirPet = async (petId) => {
      try {
        await deleteDoc(doc(db, 'pets', petId));
        alert('Pet excluído com sucesso!');
        fetchPets();
      } catch (e) {
        console.error("Erro ao excluir pet: ", e);
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
    onPress={adicionarOuAtualizarPet}
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
        <View style={styles.petDetails}>
              <Text style={styles.petName}>{item.nome}</Text>
              <Text style={styles.petType}>{item.tipo}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => editarPet(item)} style={styles.actionButton}>
            <Icon name="edit" size={25} color="#4682b4" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => excluirPet(item.id)} style={styles.actionButton}>
            <Icon name="trash" size={25} color="#ff6347" />
          </TouchableOpacity>
        </View>
      <View>
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
