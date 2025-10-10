import React, { useEffect } from 'react';
import { useToastStore, ToastComponents, ToastDefaults } from '@/store/useToastStore';
import Toast from '@/components/ui/toasts';
import { StackToast }from '@/components/StackToast';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ToastProviderProps {
	children: React.ReactNode;
	components?: ToastComponents;
	config?: ToastDefaults;
}

export function ToastProvider({ children, components, config }: ToastProviderProps) {
	const visibleToasts = useToastStore(state => state.visibleToasts);
	const removeToast = useToastStore(state => state.removeToast);
	const defaults = useToastStore(state => state.defaults);
	const setDefaults = useToastStore(state => state.setDefaults);
	const setComponents = useToastStore(state => state.setComponents);	

	useEffect(() => {
		if (components) {
			setComponents(components);
		} else {
			setComponents({
				success: (props) => <Toast {...props} />,
				error: (props) => <Toast {...props} />,
				info: (props) => <Toast {...props} />,
				warning: (props) => <Toast {...props} />,
				loading: (props) => <Toast {...props} />,
			});
		}
		if (config) {
			setDefaults(config);
		}
	}, []);

	return (
		<>
			{children}
			<StackToast
				position={config?.position ?? defaults.position}
				toasts={visibleToasts}
				onRemoveToast={removeToast}
			/>
		</>
	)
}