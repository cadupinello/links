import { Categories } from "@/components/categories";
import { Link } from "@/components/link";
import { Option } from "@/components/option";
import { linkStorage, linkStorageProps } from "@/storage/link.storage";
import { colors } from "@/styles/colors";
import { categories } from "@/utils/categories";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

export default function Index() {
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState(categories[0].name);
  const [links, setLinks] = useState<linkStorageProps[]>([]);
  const [seletedLink, setSelectedLink] = useState<linkStorageProps>(
    {} as linkStorageProps
  );

  async function getLinks() {
    try {
      const response = await linkStorage.get();

      const filtered = response.filter((link) => link.category === category);

      setLinks(filtered);
    } catch (error) {
      Alert.alert("Não foi possível carregar os links");
      console.error(error);
    }
  }

  function handleDetails(selectedLink: linkStorageProps) {
    setShowModal(true);
    setSelectedLink(selectedLink);
  }

  async function linkRemove() {
    try {
      await linkStorage.remove(seletedLink.id);
      setShowModal(false);
      getLinks();
    } catch (error) {
      Alert.alert("Não foi possível excluir o link");
      console.error(error);
    }
  }

  function handleRemove() {
    Alert.alert("Excluir", "Deseja realmente excluir o link?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: () => linkRemove(),
      },
    ]);
  }

  async function handleOpenLink() {
    try {
      await Linking.canOpenURL(seletedLink.url);
      setShowModal(false);
    } catch (error) {
      Alert.alert("Não foi possível abrir o link");
      console.error(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getLinks();
    }, [category])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("@/assets/logo.png")} style={styles.logo} />
        <TouchableOpacity onPress={() => router.navigate("/add")}>
          <MaterialIcons name="add" size={32} color={colors.green[300]} />
        </TouchableOpacity>
      </View>

      <Categories
        isSelected={category}
        onChange={({ category }) => setCategory(category)}
      />

      <FlatList
        data={links}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link
            name={item.name}
            url={item.url}
            onDetails={() => handleDetails(item)}
          />
        )}
        style={styles.links}
        contentContainerStyle={styles.linksContent}
        showsVerticalScrollIndicator={false}
      />

      <Modal transparent visible={showModal} animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalCategory}>{seletedLink.category}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <MaterialIcons
                  name="close"
                  size={20}
                  color={colors.gray[400]}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalLinkName}>{seletedLink.name}</Text>
            <Text style={styles.modalUrl}>{seletedLink.url}</Text>

            <View style={styles.modalFooter}>
              <Option
                name="Excluir"
                icon="delete"
                variant="secondary"
                onPress={handleRemove}
              />
              <Option name="Abrir" icon="language" onPress={handleOpenLink} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
