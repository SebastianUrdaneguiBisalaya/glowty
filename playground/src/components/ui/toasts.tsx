import { View, StyleSheet, Text, StyleProp, ViewStyle, TextStyle, ActivityIndicator } from "react-native";
import { Toast } from "@/store/useToastStore";
import AntDesign from '@expo/vector-icons/AntDesign';

const iconMap = {
	success: { name: "check-circle", color: "", size: 20 },
	error: { name: "exclamation-circle", color: "", size: 20 },
	info: { name: "info-circle", color: "", size: 20 },
	warning: { name: "warning", color: "", size: 20 },
	loading: { name: "loading", color: "", size: 20 },
} as const;

const DefaultToastComponent: React.FC<{ toast: Toast }> = ({ toast }) => {
	const iconData = iconMap[toast.type ?? "success"];
	const themedStyles = toast.theme === "dark" ? darkStyles : lightStyles;

	const containerStyles = StyleSheet.flatten([
		themedStyles.container,
		toast.containerStyles,
	]) as StyleProp<ViewStyle>;

	const textStyles = StyleSheet.flatten([
		themedStyles.text,
		toast.contentStyles,
	]) as StyleProp<TextStyle>;

	const iconColor = toast.contentStyles?.iconColor ?? iconData.color;

	const shouldShowLoader = toast.type === "loading" && !toast.contentStyles?.icon;
	return (
		<View style={containerStyles}>
			<Text style={textStyles}>{toast.message}</Text>
			{
				shouldShowLoader ? (
					<ActivityIndicator size={iconData.size} color={iconColor} />
				) : toast.contentStyles?.icon ? (
					toast.contentStyles?.icon
				) : (
				<AntDesign name={iconData.name} size={iconData.size} color={iconData.color} />
				)
			}
		</View>
	)

}

const baseStyles = {
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		padding: 16,
		borderRadius: 8,
	} as ViewStyle,
}

const baseText: TextStyle = {
	fontSize: 14,
	flexShrink: 1,
}

const lightStyles = {
	container: {
		...baseStyles.container,
		backgroundColor: "#FAFAFA",
	},
	text: {
		...baseText,
		color: "#000000",
	},
}

const darkStyles = {
	container: {
		...baseStyles.container,
		backgroundColor: "#262626",
	},
	text: {
		...baseText,
		color: "#FFFFFF",
	},
}

export default DefaultToastComponent;