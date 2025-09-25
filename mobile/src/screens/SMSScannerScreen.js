import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';

const SMSScannerScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message to scan');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post('/predict/sms', {
        message: message,
        sender: sender || null
      });

      setResult(response.data);
    } catch (error) {
      Alert.alert(
        'Scan Failed',
        error.response?.data?.detail || 'Failed to scan SMS. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessage('');
    setSender('');
    setResult(null);
  };

  const getRiskColor = (risk) => {
    if (risk >= 0.8) return '#f72585'; // High risk - red
    if (risk >= 0.5) return '#fca311'; // Medium risk - orange
    return '#4cc9f0'; // Low risk - blue
  };

  const getRiskText = (risk) => {
    if (risk >= 0.8) return 'HIGH RISK';
    if (risk >= 0.5) return 'MEDIUM RISK';
    return 'LOW RISK';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="chatbubbles" size={40} color="#4361ee" />
          <Text style={styles.title}>SMS Fraud Scanner</Text>
          <Text style={styles.subtitle}>Scan SMS messages for fraud</Text>
        </View>

        {/* Input Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Sender (optional)"
              placeholderTextColor="#999"
              value={sender}
              onChangeText={setSender}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.messageContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Enter SMS message to scan..."
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.scanButton, loading && styles.scanButtonDisabled]}
              onPress={handleScan}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="scan" size={20} color="#fff" />
                  <Text style={styles.scanButtonText}>Scan SMS</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
            >
              <Ionicons name="refresh" size={20} color="#666" />
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Results */}
        {result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Scan Results</Text>
            
            <View style={styles.riskContainer}>
              <View style={[styles.riskBadge, { backgroundColor: getRiskColor(result.risk_score) }]}>
                <Text style={styles.riskText}>{getRiskText(result.risk_score)}</Text>
              </View>
              <Text style={styles.riskScore}>Risk Score: {(result.risk_score * 100).toFixed(1)}%</Text>
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>Analysis Details:</Text>
              <Text style={styles.detailsText}>{result.explanation}</Text>
            </View>

            {result.suspicious_patterns && result.suspicious_patterns.length > 0 && (
              <View style={styles.patternsContainer}>
                <Text style={styles.patternsTitle}>Suspicious Patterns:</Text>
                {result.suspicious_patterns.map((pattern, index) => (
                  <Text key={index} style={styles.patternText}>• {pattern}</Text>
                ))}
              </View>
            )}

            <View style={styles.timestampContainer}>
              <Text style={styles.timestampText}>
                Scanned at: {new Date().toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Tips for Better Detection</Text>
          <Text style={styles.tipText}>• Include the full message text</Text>
          <Text style={styles.tipText}>• Add sender information if available</Text>
          <Text style={styles.tipText}>• Check for urgent language and threats</Text>
          <Text style={styles.tipText}>• Look for suspicious links or numbers</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  messageContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  messageInput: {
    padding: 15,
    fontSize: 16,
    color: '#333',
    minHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scanButton: {
    backgroundColor: '#4361ee',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: '#ccc',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  clearButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
    marginLeft: 5,
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  riskContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  riskBadge: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  riskText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  riskScore: {
    fontSize: 14,
    color: '#666',
  },
  detailsContainer: {
    marginBottom: 15,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  patternsContainer: {
    marginBottom: 15,
  },
  patternsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  patternText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  timestampContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  timestampText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    padding: 15,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default SMSScannerScreen;
