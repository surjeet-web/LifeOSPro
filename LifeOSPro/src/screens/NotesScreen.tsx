import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { generateId, formatDate } from '../utils/helpers';
import { colors, spacing, borderRadius, typography } from '../utils/theme';
import { Card, Button } from '../components/UI';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

const NotesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { state, dispatch, addXP } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const notes: Note[] = state.notes || [];

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const openNote = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
    }
    setShowModal(true);
  };

  const saveNote = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (editingNote) {
      dispatch({
        type: 'UPDATE_NOTE',
        payload: { ...editingNote, title: title.trim(), content: content.trim(), updatedAt: new Date().toISOString() },
      });
    } else {
      const newNote: Note = {
        id: generateId(),
        title: title.trim(),
        content: content.trim(),
        tags: [],
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_NOTE', payload: newNote });
      addXP(5);
    }
    setShowModal(false);
  };

  const deleteNote = (id: string) => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => dispatch({ type: 'DELETE_NOTE', payload: id }) },
    ]);
  };

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity style={styles.noteCard} onPress={() => openNote(item)} onLongPress={() => deleteNote(item.id)}>
      <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.noteContent} numberOfLines={2}>{item.content || 'No content'}</Text>
      <Text style={styles.noteDate}>{formatDate(item.createdAt)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openNote()}>
          <LinearGradient colors={['#EC4899', '#F472B6']} style={styles.addButtonGradient}>
            <Text style={styles.addButtonText}>+</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor={colors.dark.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{notes.length}</Text>
          <Text style={styles.statLabel}>Total Notes</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{notes.filter(n => n.content.length > 100).length}</Text>
          <Text style={styles.statLabel}>Long Notes</Text>
        </Card>
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        renderItem={renderNote}
        numColumns={2}
        columnWrapperStyle={styles.notesRow}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={colors.dark.textTertiary} />
            <Text style={styles.emptyTitle}>No Notes Yet</Text>
            <Text style={styles.emptyText}>Create your first note!</Text>
          </View>
        }
      />

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{editingNote ? 'Edit Note' : 'New Note'}</Text>
              <TouchableOpacity onPress={saveNote}>
                <Text style={styles.modalSave}>Save</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              placeholder="Note title..."
              placeholderTextColor={colors.dark.textTertiary}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.modalInput, styles.modalContentInput]}
              placeholder="Start writing..."
              placeholderTextColor={colors.dark.textTertiary}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.dark.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  title: { ...typography.h2, color: colors.dark.text },
  addButton: {},
  addButtonGradient: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { fontSize: 24, color: '#FFF', fontWeight: '300' },
  searchContainer: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  searchInput: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.md, padding: spacing.md, color: colors.dark.text, fontSize: 16 },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.md, marginBottom: spacing.md },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.md },
  statNumber: { ...typography.h4, color: colors.dark.text },
  statLabel: { ...typography.caption, color: colors.dark.textSecondary },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
  notesRow: { justifyContent: 'space-between' },
  noteCard: { width: '48%', backgroundColor: colors.dark.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md },
  noteTitle: { ...typography.body, color: colors.dark.text, fontWeight: '600', marginBottom: spacing.xs },
  noteContent: { ...typography.caption, color: colors.dark.textSecondary, flex: 1 },
  noteDate: { ...typography.caption, color: colors.dark.textTertiary, marginTop: spacing.sm },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyEmoji: { fontSize: 60, marginBottom: spacing.md },
  emptyTitle: { ...typography.h5, color: colors.dark.text },
  emptyText: { ...typography.bodySmall, color: colors.dark.textSecondary },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.dark.background, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing.lg, height: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  modalCancel: { color: colors.dark.textSecondary, fontSize: 16 },
  modalTitle: { ...typography.h5, color: colors.dark.text },
  modalSave: { color: colors.dark.primary, fontSize: 16, fontWeight: '600' },
  modalInput: { backgroundColor: colors.dark.surface, borderRadius: borderRadius.md, padding: spacing.md, color: colors.dark.text, fontSize: 16, marginBottom: spacing.md },
  modalContentInput: { flex: 1, minHeight: 200 },
});

export default NotesScreen;
