import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import dados from './dados.json';

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function normalizeRM(value) {
  return String(value ?? '').trim();
}

export default function App() {
  const [rm, setRm] = useState('');
  const [nome, setNome] = useState('');
  const [curso, setCurso] = useState('');
  const [resultado, setResultado] = useState([]);
  const [mensagem, setMensagem] = useState(
    'Preencha um ou mais filtros para consultar.'
  );

  const totalEncontrados = useMemo(() => resultado.length, [resultado]);

  const consultarDados = () => {
    const rmFiltro = normalizeRM(rm);
    const nomeFiltro = normalize(nome);
    const cursoFiltro = normalize(curso);

    if (!rmFiltro && !nomeFiltro && !cursoFiltro) {
      setResultado([]);
      setMensagem('Preencha um ou mais filtros para consultar.');
      Alert.alert('Atenção', 'Informe ao menos um filtro de pesquisa.');
      return;
    }

    const filtrados = dados.filter((item) => {
      const itemRM = normalizeRM(item.rm);
      const itemNome = normalize(item.nome);
      const itemCurso = normalize(item.curso);

      const matchRM = rmFiltro ? itemRM === rmFiltro : true;
      const matchNome = nomeFiltro ? itemNome.includes(nomeFiltro) : true;
      const matchCurso = cursoFiltro ? itemCurso.includes(cursoFiltro) : true;

      return matchRM && matchNome && matchCurso;
    });

    setResultado(filtrados);

    if (filtrados.length === 0) {
      setMensagem('Nenhum aluno encontrado.');
      Alert.alert(
        'Resultado',
        'Nenhum aluno encontrado para os filtros informados.'
      );
    } else {
      setMensagem(`${filtrados.length} aluno(s) encontrado(s).`);
    }
  };

  const limpar = () => {
    setRm('');
    setNome('');
    setCurso('');
    setResultado([]);
    setMensagem('Preencha um ou mais filtros para consultar.');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>RM {item.rm}</Text>
        </View>
      </View>
      <Text style={styles.cardTitle}>{item.nome}</Text>
      <Text style={styles.cardText}>Curso: {item.curso}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.topBand} />

        <View style={styles.header}>
          <Text style={styles.kicker}>Consulta de alunos</Text>
          <Text style={styles.title}>Sistema de consulta</Text>
          <Text style={styles.subtitle}>
            Consulte dados dos alunos.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>RM</Text>
          <TextInput
            value={rm}
            onChangeText={setRm}
            placeholder="Ex: 1"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            keyboardType="numeric"
            returnKeyType="next"
          />

          <Text style={[styles.label, styles.labelSpacing]}>Nome</Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Ana Souza"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
          />

          <Text style={[styles.label, styles.labelSpacing]}>Curso</Text>
          <TextInput
            value={curso}
            onChangeText={setCurso}
            placeholder="Ex: 1M-DS, 2M-ADM"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={consultarDados}
          />

          <View style={styles.buttonRow}>
            <Pressable
              onPress={consultarDados}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}>
              <Text style={styles.primaryButtonText}>Verificar</Text>
            </Pressable>

            <Pressable
              onPress={limpar}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}>
              <Text style={styles.secondaryButtonText}>Limpar</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.infoBar}>
          <Text style={styles.infoText}>{mensagem}</Text>
          <Text style={styles.infoCount}>
            {totalEncontrados > 0 ? `${totalEncontrados}` : ''}
          </Text>
        </View>

        <FlatList
          data={resultado}
          keyExtractor={(item, index) => String(item.rm ?? index)}
          renderItem={renderItem}
          contentContainerStyle={
            resultado.length ? styles.listContent : styles.emptyList
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Sem resultados</Text>
              <Text style={styles.emptyText}>
                Use um ou mais filtros para realizar a consulta.
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F7FB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  topBand: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#1B4E9B',
    marginBottom: 16,
  },
  header: {
    marginBottom: 16,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B4E9B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#5B6472',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5ECF5',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  labelSpacing: {
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#D9E2EC',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#1B4E9B',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#E8EEF7',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButtonText: {
    color: '#1B4E9B',
    fontSize: 16,
    fontWeight: '800',
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#5B6472',
  },
  infoCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1B4E9B',
    marginLeft: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5ECF5',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#5B6472',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5ECF5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#E8EEF7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: '#1B4E9B',
    fontSize: 12,
    fontWeight: '800',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
  },
});
