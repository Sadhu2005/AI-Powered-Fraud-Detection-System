import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../services/api';

const { width, height } = Dimensions.get('window');

const QRScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    getCameraPermissions();
  }, []);

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned) return;
    
    setScanned(true);
    setLoading(true);
    setResult(null);

    try {
      // Analyze the scanned data
      const response = await api.post('/predict/url', {
        url: data
      });

      setResult({
        data: data,
        type: type,
        analysis: response.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      Alert.alert(
        'Analysis Failed',
        'Failed to analyze the scanned data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setResult(null);
  };

  const handleOpenCamera = () => {
    setShowCamera(true);
    setScanned(false);
    setResult(null);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    setScanned(false);
  };

  const getRiskColor = (risk) => {
    if (risk >= 0.8) return '#f72585';
    if (risk >= 0.5) return '#fca311';
    return '#4cc9f0';
  };

  const getRiskText = (risk) => {
    if (risk >= 0.8) return 'HIGH RISK';
    if (risk >= 0.5) return 'MEDIUM RISK';
    return 'LOW RISK';
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off" size={60} color="#666" />
        <Text style={styles.message}>Camera permission denied</Text>
        <TouchableOpacity style={styles.button} onPress={getCameraPermissions}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        
        {/* Camera Overlay */}
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <View style={styles.scanArea}>
              <View style={styles.scanFrame} />
            </View>
            <View style={styles.sideOverlay} />
          </View>
          <View style={styles.bottomOverlay} />
        </View>

        {/* Camera Controls */}
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseCamera}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.scanInstructions}>
            <Text style={styles.scanText}>Position QR code within the frame</Text>
          </View>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4361ee" />
            <Text style={styles.loadingText}>Analyzing...</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="qr-code" size={40} color="#4361ee" />
        <Text style={styles.title}>QR Code Scanner</Text>
        <Text style={styles.subtitle}>Scan QR codes for fraud detection</Text>
      </View>

      {/* Scan Button */}
      <TouchableOpacity style={styles.scanButton} onPress={handleOpenCamera}>
        <Ionicons name="camera" size={30} color="#fff" />
        <Text style={styles.scanButtonText}>Scan QR Code</Text>
      </TouchableOpacity>

      {/* Results */}
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Scan Results</Text>
          
          <View style={styles.dataContainer}>
            <Text style={styles.dataLabel}>Scanned Data:</Text>
            <Text style={styles.dataText}>{result.data}</Text>
          </View>

          <View style={styles.riskContainer}>
            <View style={[styles.riskBadge, { backgroundColor: getRiskColor(result.analysis.risk_score) }]}>
              <Text style={styles.riskText}>{getRiskText(result.analysis.risk_score)}</Text>
            </View>
            <Text style={styles.riskScore}>Risk Score: {(result.analysis.risk_score * 100).toFixed(1)}%</Text>
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Analysis Details:</Text>
            <Text style={styles.detailsText}>{result.analysis.explanation}</Text>
          </View>

          {result.analysis.suspicious_patterns && result.analysis.suspicious_patterns.length > 0 && (
            <View style={styles.patternsContainer}>
              <Text style={styles.patternsTitle}>Suspicious Patterns:</Text>
              {result.analysis.suspicious_patterns.map((pattern, index) => (
                <Text key={index} style={styles.patternText}>• {pattern}</Text>
              ))}
            </View>
          )}

          <View style={styles.timestampContainer}>
            <Text style={styles.timestampText}>
              Scanned at: {new Date(result.timestamp).toLocaleString()}
            </Text>
          </View>

          <TouchableOpacity style={styles.scanAgainButton} onPress={handleScanAgain}>
            <Ionicons name="refresh" size={20} color="#4361ee" />
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 QR Code Safety Tips</Text>
        <Text style={styles.tipText}>• Only scan QR codes from trusted sources</Text>
        <Text style={styles.tipText}>• Check the URL before visiting</Text>
        <Text style={styles.tipText}>• Be cautious of QR codes in public places</Text>
        <Text style={styles.tipText}>• Verify the source before scanning</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  scanButton: {
    backgroundColor: '#4361ee',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  middleRow: {
    flexDirection: 'row',
    height: 200,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanArea: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#4361ee',
    borderRadius: 10,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cameraControls: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 10,
  },
  scanInstructions: {
    flex: 1,
    alignItems: 'center',
  },
  scanText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
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
  dataContainer: {
    marginBottom: 15,
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  dataText: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
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
    marginBottom: 15,
  },
  timestampText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  scanAgainButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanAgainText: {
    color: '#4361ee',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
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
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4361ee',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default QRScannerScreen;
