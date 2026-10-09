import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { Text, View } from '../../components/Themed';
import { GlobalStyles } from '../../screens/shared/global-styles';

export default function HomeScreen() {
	const { t } = useTranslation();

	return (
		<View style={GlobalStyles.container}>
			<View>
				<Text style={styles.title}>{t('home')}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
});