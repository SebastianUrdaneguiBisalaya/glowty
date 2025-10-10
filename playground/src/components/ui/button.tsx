import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { colors } from "@/constants/colors";

export type ButtonType = 'success' | 'info' | 'warning' | 'error' | 'loading';

interface ButtonProps {
	children: React.ReactNode;
	onPress?: () => void;
	type: ButtonType;
}

export default function Button({ children, onPress, type}: ButtonProps) {
	const buttonStyles = ({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => {
		const opacity = pressed ? 0.7 : 1;
		return StyleSheet.flatten([
			styles.base,
			{
				backgroundColor: colors[type],
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
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderRadius: 8,
	}
})