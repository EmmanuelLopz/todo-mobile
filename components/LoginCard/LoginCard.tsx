import Button from '@/components/Button/Button';
import { Text } from '@/components/ui/text';
import React from 'react';
import { TextInput, View } from 'react-native';

type Props = {
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
};

const LoginCard: React.FC<Props> = ({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) => {
  return (
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
      <Text style={{ fontSize: 22, fontWeight: '700', color: '#191C23', marginBottom: 4 }}>
        Welcome back
      </Text>
      <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
        Sign in to continue learning
      </Text>

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
            onChangeText={onEmailChange}
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
            onChangeText={onPasswordChange}
            placeholder="••••••••"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            style={{ fontSize: 16, color: '#191C23' }}
          />
        </View>
      </View>

      <Button
        label="Sign In"
        onPress={onSubmit}
        loading={loading}
        disabled={loading}
      />
    </View>
  );
};

export default LoginCard;
