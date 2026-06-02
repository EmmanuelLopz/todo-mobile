import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import LoginCard from '@/components/LoginCard/LoginCard';
import { useAuth } from '@/context/AuthContext';
import { login } from '@/services/authService';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';

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
      setIsAuthenticated(true);
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
      {/* Decorative top background */}
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

        <LoginCard
          email={email}
          password={password}
          loading={loading}
          error={error}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
        />

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
