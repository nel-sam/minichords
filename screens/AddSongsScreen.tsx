import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput } from 'react-native';
import McColumn from '../components/McColumn';
import { McSeparator } from '../components/McSeparator/McSeparator';

export default function AddSongsScreen() {
  const { t } = useTranslation();
  const [songNameInput, setSongNameInput] = useState('');
  const [artistName, setArtistName] = useState('');

  return (
    <McColumn
      child={
        <>
          <McSeparator />
          <TextInput
            style={styles.input}
            onChangeText={(val) => setSongNameInput(val)}
            value={songNameInput}
            placeholder={t('song-name')}
          />
          <TextInput
            style={styles.input}
            onChangeText={(val) => setArtistName(val)}
            value={artistName}
            placeholder={t('artist-name')}
          />
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
