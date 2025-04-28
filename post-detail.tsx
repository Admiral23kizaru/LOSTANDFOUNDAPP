import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;
export default function PostDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(
    params.comments ? JSON.parse(params.comments as string) : []
  );
  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: Date.now(),
        user: 'You',
        text: newComment.trim(),
        date: 'Just now',
        timestamp: Date.now()
      };
      
      setComments([newCommentObj, ...comments]);
      setNewComment('');
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = ({ nativeEvent }: any) => {
    if (nativeEvent.key === 'Enter') {
      handleAddComment();
    }
  };

  const formatCommentDate = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    
    if (diff < minute) return 'Just now';
    if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
    if (diff < day) return `${Math.floor(diff / hour)}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const getItemIcon = (type: string) => {
    switch(type) {
      case 'wallet': return <FontAwesome name="money" size={isSmallDevice ? 20 : 24} color="#A00" />;
      case 'key': return <FontAwesome name="key" size={isSmallDevice ? 20 : 24} color="#A00" />;
      case 'phone': return <Ionicons name="phone-portrait" size={isSmallDevice ? 20 : 24} color="#A00" />;
      case 'bag': return <Ionicons name="bag" size={isSmallDevice ? 20 : 24} color="#A00" />;
      default: return <MaterialCommunityIcons name="help-circle" size={isSmallDevice ? 20 : 24} color="#A00" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={isSmallDevice ? 24 : 28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Details</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.itemCard}>
          <View style={styles.itemHeader}>
            {getItemIcon(params.type as string)}
            <Text style={styles.itemTitle}>{params.title}</Text>
          </View>
          {params.image && (
            <Image source={{ uri: params.image as string }} style={styles.itemImage} />
          )}
          <Text style={styles.itemDescription}>{params.description}</Text>
          <View style={styles.itemFooter}>
            <Text style={styles.itemDate}>{params.date}</Text>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>Comments ({comments.length})</Text>
          
          {comments.length > 0 ? (
            comments.map((comment: any) => (
              <View key={comment.id} style={styles.commentCard}>
                <View style={styles.commentHeader}>
                  <Ionicons name="person-circle" size={20} color="#A00" />
                  <Text style={styles.commentUser}>{comment.user}</Text>
                  <Text style={styles.commentDate}>{formatCommentDate(comment.timestamp)}</Text>
                </View>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={setNewComment}
          onSubmitEditing={handleAddComment}
          returnKeyType="send"
          blurOnSubmit={false}
          multiline
          maxLength={200}
        />
        <TouchableOpacity 
          style={[styles.commentButton, !newComment.trim() && styles.disabledButton]}
          onPress={handleAddComment}
          disabled={!newComment.trim()}
        >
          <Ionicons name="send" size={20} color={newComment.trim() ? "#A00" : "#ccc"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#A00',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 10,
  },
  itemCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  itemImage: {
    width: '100%',
    height: width * 0.6,
    borderRadius: 6,
    marginVertical: 8,
  },
  itemDescription: {
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
    fontSize: 14,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemDate: {
    color: '#888',
    fontSize: 12,
  },
  commentsSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  commentCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentUser: {
    fontWeight: 'bold',
    marginLeft: 8,
    marginRight: 10,
    fontSize: 14,
  },
  commentDate: {
    color: '#888',
    fontSize: 12,
  },
  commentText: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20,
  },
  noCommentsText: {
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  commentButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});