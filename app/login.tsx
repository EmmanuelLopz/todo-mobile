import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/context/AuthContext';
import { login } from '@/services/authService';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const { setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      setIsAuthenticated(true); // triggers NavigationGuard to push to /(tabs)
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#F2F3FD' }}
    >
      {/* Fondo superior decorativo */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '40%',
        backgroundColor: '#005BBF',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
      }} />

      <Box className="flex-1 px-6 justify-center">

        {/* Logo / Header */}
        <Box className="items-center mb-8">
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 20,
            padding: 16,
            marginBottom: 16,
          }}>
            <Text style={{ fontSize: 40 }}>📚</Text>
          </View>
          <Text style={{
            fontSize: 32,
            fontWeight: '800',
            color: '#FFFFFF',
            letterSpacing: -0.8,
            marginBottom: 4,
          }}>
            EduTask
          </Text>
          <Text style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.8)',
            fontWeight: '400',
          }}>
            Your academic companion
          </Text>
        </Box>

        {/* Card de login */}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: 28,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 24,
          elevation: 8,
        }}>

          <Text style={{
            fontSize: 22,
            fontWeight: '700',
            color: '#191C23',
            marginBottom: 4,
          }}>
            Welcome back
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#6B7280',
            marginBottom: 24,
          }}>
            Sign in to continue learning
          </Text>

          {/* Error */}
          {error && (
            <View style={{
              backgroundColor: '#FFF0F0',
              borderRadius: 12,
              padding: 12,
              marginBottom: 16,
              borderLeftWidth: 4,
              borderLeftColor: '#BA1A1A',
            }}>
              <Text style={{ color: '#BA1A1A', fontSize: 13 }}>{error}</Text>
            </View>
          )}

          {/* Email */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{
              fontSize: 11,
              fontWeight: '700',
              color: '#414754',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 8,
              paddingLeft: 4,
            }}>
              Email
            </Text>
            <View style={{
              backgroundColor: '#F2F3FD',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderWidth: 1,
              borderColor: '#E0E2EC',
            }}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{ fontSize: 16, color: '#191C23' }}
              />
            </View>
          </View>

          {/* Password */}
          <View style={{ marginBottom: 28 }}>
            <Text style={{
              fontSize: 11,
              fontWeight: '700',
              color: '#414754',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 8,
              paddingLeft: 4,
            }}>
              Password
            </Text>
            <View style={{
              backgroundColor: '#F2F3FD',
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderWidth: 1,
              borderColor: '#E0E2EC',
            }}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                style={{ fontSize: 16, color: '#191C23' }}
              />
            </View>
          </View>

          {/* Botón */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#93C5FD' : '#005BBF',
              borderRadius: 14,
              padding: 16,
              alignItems: 'center',
              shadowColor: '#005BBF',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {loading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>
                  Sign In
                </Text>
            }
          </TouchableOpacity>

        </View>

        {/* Footer */}
        <Text style={{
          textAlign: 'center',
          color: '#6B7280',
          fontSize: 12,
          marginTop: 24,
        }}>
          Scholarly Atelier © 2024
        </Text>

      </Box>
    </KeyboardAvoidingView>
  );
}
