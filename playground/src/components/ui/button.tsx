import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { useThemeStore } from "@/store/useThemeStore";

interface ButtonProps {
	children: React.ReactNode;
	onPress?: () => void;
}

export default function Button({ children, onPress }: ButtonProps) {
	const { themes } = useThemeStore();
	const buttonStyles = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => {
		const opacity = pressed ? 0.7 : 1;
		return StyleSheet.flatten([
			styles.base,
			{
				backgroundColor: themes.typography.display,
				opacity,
			}
		])
	}
	return (
		<Pressable style={buttonStyles} onPress={onPress}>
			{children}
		</Pressable>
	)
}

const styles = StyleSheet.create({
	base: {
		paddingHorizontal: 20,
		paddingVertical: 18,
		borderRadius: 8,
	}
})