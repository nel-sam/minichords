import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, TouchableOpacity } from 'react-native';

import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';
import { MonoText } from './StyledText';
import { Text, View, useThemeColor } from './Themed';

export default function EditScreenInfo({ path }: { path: string }) {
  const colorScheme = useColorScheme();
  const secondaryText = useThemeColor({}, 'muted');

  return (
    <View>
      <View style={styles.getStartedContainer}>
        <Text style={[styles.getStartedText, { color: secondaryText }]}>
          Open up the code for this screen:
        </Text>

        <View
          style={[
            styles.codeHighlightContainer,
            styles.homeScreenFilename,
            { backgroundColor: Colors[colorScheme].codeSurface },
          ]}>
          <MonoText>{path}</MonoText>
        </View>

        <Text style={[styles.getStartedText, { color: secondaryText }]}>
          Change any of the text, save the file, and your app will automatically update.
        </Text>
      </View>

      <View style={styles.helpContainer}>
        <TouchableOpacity onPress={handleHelpPress} style={styles.helpLink}>
          <Text style={[styles.helpLinkText, { color: Colors[colorScheme].accent }]}>
            Tap here if your app doesn't automatically update after making changes
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet'
  );
}

const styles = StyleSheet.create({
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    textAlign: 'center',
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  },
});
