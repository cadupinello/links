import { categories } from "@/utils/categories";
import { FlatList } from "react-native";
import { Category } from "../category";
import { styles } from "./style";

type CategoryProps = {
  isSelected: string;
  onChange: ({
    name,
    url,
    category,
  }: {
    name: string;
    url: string;
    category: string;
  }) => void;
};

export function Categories({ isSelected, onChange }: CategoryProps) {
  console.log(isSelected);
  return (
    <FlatList
      data={categories}
      keyExtractor={(category) => category.id}
      horizontal
      style={styles.container}
      contentContainerStyle={styles.content}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <Category
          name={item.name}
          icon={item.icon}
          isSelected={item.name === isSelected}
          onPress={() => onChange({ category: item.name })}
        />
      )}
    />
  );
}
