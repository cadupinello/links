import { Button } from "@/components/button";
import { Categories } from "@/components/categories";
import { Input } from "@/components/input";
import { linkStorage } from "@/storage/link.storage";
import { colors } from "@/styles/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export default function Add() {
  const [form, setForm] = useState({
    name: "",
    url: "",
    category: "",
  });
  const handleAdd = async () => {
    try {
      if (!form.category) {
        return Alert.alert("Selecione a categoria");
      }

      if (!form.name?.trim() || !form.url?.trim()) {
        return Alert.alert("Preencha todos os campos");
      }

      await linkStorage.save({
        id: new Date().getTime().toString(),
        name: form.name,
        url: form.url,
        category: form.category,
      });

      Alert.alert("Sucesso", "Novo link adicionado", [
        {
          text: "Ok",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert("Não foi possível adicionar o link");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={32} color={colors.gray[200]} />
        </TouchableOpacity>
        <Text style={styles.title}>Novo</Text>
      </View>
      <Text style={styles.label}>Selecione uma categoria</Text>

      <Categories
        isSelected={form.category}
        onChange={(category) =>
          setForm({ ...form, category: category.category })
        }
      />

      <View style={styles.form}>
        <Input
          placeholder="Nome"
          onChangeText={(name) => setForm({ ...form, name })}
        />
        <Input
          placeholder="URL"
          onChangeText={(url) => setForm({ ...form, url })}
          autoCorrect={false}
          autoCapitalize="none"
        />

        <Button title="Adicionar" onPress={handleAdd} />
      </View>
    </View>
  );
}
