import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleAuth = () => {
    if (isLogin) {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password');
        return;
      }
      console.log('Logging in with:', email, password);
      router.replace('/home');
    } else {
      if (!email || !password || !confirmPassword || !username || !profileImage) {
        Alert.alert('Error', 'Please fill all fields including profile picture');
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords don't match!");
        return;
      }
      console.log('Signing up with:', { email, password, username, profileImage });
      router.replace({
        pathname: '/home',
        params: { username, profileImage }
      });
    }
  };

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return (
      <View style={styles.welcomeContainer}>
        <View style={styles.welcomeIconContainer}>
          <Ionicons name="search" size={80} color="#D0E0FF" style={styles.welcomeIcon} />
        </View>
        <Text style={styles.welcomeText}>Welcome to Lost & Found Hub</Text>
        <Text style={styles.welcomeText}> Let’s Reunite What’s Lost</Text>
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#D0E0FF" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>
        
        {!isLogin && (
          <>
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImagePreview} />
              ) : (
                <Ionicons name="camera" size={24} color="#D0E0FF" />
              )}
              <Text style={styles.uploadButtonText}>
                {profileImage ? 'Change Profile Picture' : 'Upload Profile Picture'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#A0B0C0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#A0B0C0"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </>
        )}
        
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#A0B0C0" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A0B0C0"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#A0B0C0" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#A0B0C0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        {!isLogin && (
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#A0B0C0" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#A0B0C0"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        )}
        
        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
          <Ionicons name={isLogin ? "log-in" : "person-add"} size={20} color="#0F0F1A" style={styles.buttonIcon} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={() => setIsLogin(!isLogin)}
        >
          <Ionicons 
            name={isLogin ? "person-add" : "log-in"} 
            size={16} 
            color="#A0B0C0" 
            style={styles.toggleIcon} 
          />
          <Text style={styles.toggleText}>
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  welcomeIconContainer: {
    backgroundColor: '#1A1A2A',
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  welcomeIcon: {
    opacity: 0.9,
  },
  welcomeText: {
    color: '#D0E0FF',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 60,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: '#2A2A3A',
    padding: 16,
    borderRadius: 8,
    width: '70%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3A3A4A',
  },
  getStartedText: {
    color: '#D0E0FF',
    fontWeight: '500',
    fontSize: 18,
    marginRight: 10,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1A1A2A',
    padding: 25,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  title: {
    color: '#D0E0FF',
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2A',
    borderRadius: 8,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#2A2A3A',
    paddingHorizontal: 15,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#E0F0FF',
    height: '100%',
    fontSize: 15,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2A',
    padding: 15,
    borderRadius: 8,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#2A2A3A',
    height: 52,
  },
  uploadButtonText: {
    marginLeft: 12,
    color: '#D0E0FF',
    fontSize: 15,
  },
  profileImagePreview: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#3A3A4A',
  },
  button: {
    backgroundColor: '#D0E0FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#0F0F1A',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  toggleButton: {
    padding: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  toggleIcon: {
    marginRight: 8,
  },
  toggleText: {
    color: '#A0B0C0',
    fontSize: 14,
  },
});