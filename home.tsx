import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type ItemType = 'wallet' | 'key' | 'phone' | 'bag';

interface Item {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
  type: ItemType;
  comments?: Array<{
    id: number;
    user: string;
    text: string;
    date: string;
  }>;
}

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'lost' | 'found' | 'notifications' | 'create'>('lost');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [lostItems, setLostItems] = useState<Item[]>([]);
  const [foundItems, setFoundItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);

  // Fetch user posts from API or local storage
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setTimeout(() => {
          const fetchedLostItems: Item[] = [
            { 
              id: 1, 
              title: 'Lost Wallet', 
              description: 'Black leather wallet with ID cards', 
              date: '2 days ago',
              image: 'https://images.unsplash.com/photo-1551806235-6693c8b4d1c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
              type: 'wallet',
              comments: [
                { id: 1, user: 'John', text: 'I think I saw this at the cafeteria', date: '1 day ago' }
              ]
            },
            { 
              id: 2, 
              title: 'Lost Keys', 
              description: 'House keys with blue keychain', 
              date: '1 day ago',
              image: 'https://images.unsplash.com/photo-1593891125785-c0e5e07a7027?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
              type: 'key'
            },
            ...(params.title ? [{
              id: 3,
              title: params.title as string,
              description: params.description as string,
              date: 'Just now',
              image: params.image as string || 'https://images.unsplash.com/photo-1593891125785-c0e5e07a7027?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
              type: (params.type as ItemType) || 'wallet'
            }] : [])
          ];

          const fetchedFoundItems: Item[] = [
            { 
              id: 1, 
              title: 'Found Phone', 
              description: 'iPhone 13 with black case', 
              date: '3 hours ago',
              image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
              type: 'phone',
              comments: [
                { id: 1, user: 'Sarah', text: 'Is this still available?', date: '2 hours ago' },
                { id: 2, user: 'Mike', text: 'I lost a similar phone', date: '1 hour ago' }
              ]
            },
            { 
              id: 2, 
              title: 'Found Backpack', 
              description: 'Red backpack with books', 
              date: 'Yesterday',
              image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
              type: 'bag'
            },
            ...(params.title && params.type === 'found' ? [{
              id: 3,
              title: params.title as string,
              description: params.description as string,
              date: 'Just now',
              image: params.image as string || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
              type: (params.type as ItemType) || 'bag'
            }] : [])
          ];

          setLostItems(fetchedLostItems);
          setFoundItems(fetchedFoundItems);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, [params]);

  const handleLogout = (): void => {
    router.replace('/');
  };

  const handleReportLost = (): void => {
    setIsSidebarOpen(false);
    router.push({
      pathname: '/create-post',
      params: { type: 'lost' }
    });
  };

  const handleReportFound = (): void => {
    setIsSidebarOpen(false);
    router.push({
      pathname: '/create-post',
      params: { type: 'found' }
    });
  };

  const getItemIcon = (type: ItemType): JSX.Element => {
    switch(type) {
      case 'wallet': return <FontAwesome name="money" size={isSmallDevice ? 20 : 24} color="#A00" />;
      case 'key': return <FontAwesome name="key" size={isSmallDevice ? 20 : 24} color="#A00" />;
      case 'phone': return <Ionicons name="phone-portrait" size={isSmallDevice ? 20 : 24} color="#A00" />;
      case 'bag': return <Ionicons name="bag" size={isSmallDevice ? 20 : 24} color="#A00" />;
      default: return <MaterialCommunityIcons name="help-circle" size={isSmallDevice ? 20 : 24} color="#A00" />;
    }
  };

  const handleCommentPress = (item: Item): void => {
    router.push({
      pathname: '/post-detail',
      params: {
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.date,
        image: item.image,
        type: item.type,
        comments: JSON.stringify(item.comments || [])
      }
    });
  };

  const toggleSearch = (): void => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  const filterItems = (items: Item[]): Item[] => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      {isSidebarOpen && (
        <View style={[styles.sidebar, { width: width * 0.7 }]}>
          <View style={styles.sidebarHeader}>
            {params.profileImage ? (
              <Image 
                source={{ uri: params.profileImage as string }} 
                style={{ 
                  width: isSmallDevice ? 60 : 80, 
                  height: isSmallDevice ? 60 : 80, 
                  borderRadius: 40 
                }} 
              />
            ) : (
              <Ionicons name="person-circle" size={isSmallDevice ? 60 : 80} color="#fff" />
            )}
            <Text style={styles.sidebarUsername}>
              {params.username || 'Akashi'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={() => {
              setActiveTab('notifications');
              setIsSidebarOpen(false);
            }}
          >
            <View style={styles.sidebarItemContent}>
              <Ionicons name="notifications" size={isSmallDevice ? 18 : 20} color="#fff" />
              <Text style={styles.sidebarText}>Notifications</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={handleReportLost}
          >
            <View style={styles.sidebarItemContent}>
              <MaterialCommunityIcons name="alert-circle-outline" size={isSmallDevice ? 18 : 20} color="#fff" />
              <Text style={styles.sidebarText}>Report Lost Item</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={handleReportFound}
          >
            <View style={styles.sidebarItemContent}>
              <MaterialCommunityIcons name="check-circle-outline" size={isSmallDevice ? 18 : 20} color="#fff" />
              <Text style={styles.sidebarText}>Report Found Item</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sidebarItem}
            onPress={handleLogout}
          >
            <View style={styles.sidebarItemContent}>
              <MaterialCommunityIcons name="logout" size={isSmallDevice ? 18 : 20} color="#fff" />
              <Text style={styles.sidebarText}>Logout</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.developerCredit}>
            <Text style={styles.developerText}>DEVELOPED BY AARON RYO</Text>
          </View>
        </View>
      )}

      {/* Main Content */}
      <View style={[styles.mainContent, { marginLeft: isSidebarOpen ? width * 0.7 : 0 }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Ionicons name="menu" size={isSmallDevice ? 24 : 28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lost & Found</Text>
          <TouchableOpacity onPress={toggleSearch}>
            <Ionicons name="search" size={isSmallDevice ? 20 : 24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search items..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus={true}
            />
            <TouchableOpacity onPress={toggleSearch} style={styles.searchClose}>
              <Ionicons name="close" size={20} color="#A00" />
            </TouchableOpacity>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'lost' && styles.activeTab]}
            onPress={() => setActiveTab('lost')}
          >
            <View style={styles.tabContent}>
              <MaterialCommunityIcons 
                name="emoticon-sad-outline" 
                size={isSmallDevice ? 16 : 20} 
                color={activeTab === 'lost' ? '#fff' : '#A00'} 
              />
              <Text style={[styles.tabText, activeTab === 'lost' && styles.activeTabText]}>
                Lost Items
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'found' && styles.activeTab]}
            onPress={() => setActiveTab('found')}
          >
            <View style={styles.tabContent}>
              <MaterialCommunityIcons 
                name="emoticon-happy-outline" 
                size={isSmallDevice ? 16 : 20} 
                color={activeTab === 'found' ? '#fff' : '#A00'} 
              />
              <Text style={[styles.tabText, activeTab === 'found' && styles.activeTabText]}>
                Found Items
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text>Loading posts...</Text>
            </View>
          ) : (
            <>
              {activeTab === 'lost' && (
                <>
                  {filterItems(lostItems).length === 0 ? (
                    <View style={styles.noResults}>
                      <Text>No lost items found</Text>
                    </View>
                  ) : (
                    filterItems(lostItems).map((item: Item) => (
                      <View key={item.id} style={styles.itemCard}>
                        <View style={styles.itemHeader}>
                          {getItemIcon(item.type)}
                          <Text style={styles.itemTitle}>{item.title}</Text>
                        </View>
                        {item.image && (
                          <TouchableOpacity onPress={() => handleCommentPress(item)}>
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                          </TouchableOpacity>
                        )}
                        <Text style={styles.itemDescription}>{item.description}</Text>
                        <View style={styles.itemFooter}>
                          <Text style={styles.itemDate}>{item.date}</Text>
                          <TouchableOpacity 
                            style={styles.commentButton}
                            onPress={() => handleCommentPress(item)}
                          >
                            <Ionicons name="chatbubble-outline" size={isSmallDevice ? 16 : 18} color="#A00" />
                            <Text style={styles.commentText}>
                              {item.comments?.length || 0} comments
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </>
              )}

              {activeTab === 'found' && (
                <>
                  {filterItems(foundItems).length === 0 ? (
                    <View style={styles.noResults}>
                      <Text>No found items found</Text>
                    </View>
                  ) : (
                    filterItems(foundItems).map((item: Item) => (
                      <View key={item.id} style={styles.itemCard}>
                        <View style={styles.itemHeader}>
                          {getItemIcon(item.type)}
                          <Text style={styles.itemTitle}>{item.title}</Text>
                        </View>
                        {item.image && (
                          <TouchableOpacity onPress={() => handleCommentPress(item)}>
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                          </TouchableOpacity>
                        )}
                        <Text style={styles.itemDescription}>{item.description}</Text>
                        <View style={styles.itemFooter}>
                          <Text style={styles.itemDate}>{item.date}</Text>
                          <TouchableOpacity 
                            style={styles.commentButton}
                            onPress={() => handleCommentPress(item)}
                          >
                            <Ionicons name="chatbubble-outline" size={isSmallDevice ? 16 : 18} color="#A00" />
                            <Text style={styles.commentText}>
                              {item.comments?.length || 0} comments
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </>
              )}

              {activeTab === 'notifications' && (
                <View style={styles.notificationCard}>
                  <Ionicons name="notifications-off" size={isSmallDevice ? 40 : 50} color="#A00" />
                  <Text style={styles.notificationText}>No new notifications</Text>
                </View>
              )}

              {activeTab === 'create' && (
                <View style={styles.createPostCard}>
                  <Ionicons name="create" size={isSmallDevice ? 40 : 50} color="#A00" />
                  <Text style={styles.createPostTitle}>Create New Post</Text>
                  <Text style={styles.createPostText}>Post creation form would go here</Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#333',
    paddingTop: 40,
    zIndex: 100,
    marginTop: 60, // Added to account for header height
  },
  sidebarHeader: {
    alignItems: 'center',
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    marginBottom: 20,
  },
  sidebarUsername: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
  sidebarItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  sidebarItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sidebarText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
  developerCredit: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  developerText: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mainContent: {
    flex: 1,
    marginTop: 60, // Added to push content below header
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#A00',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 101, // Added to bring header above sidebar
    height: 60, // Added fixed height
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  searchClose: {
    marginLeft: 10,
    padding: 5,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#A00',
  },
  tabText: {
    color: '#A00',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
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
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    color: '#A00',
    marginLeft: 5,
    fontSize: 12,
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  notificationText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  createPostCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  createPostTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  createPostText: {
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});