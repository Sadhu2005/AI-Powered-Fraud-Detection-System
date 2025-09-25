import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card, Title, Paragraph, Button, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const features = [
    {
      title: 'SMS Scanner',
      description: 'Detect spam and phishing messages',
      icon: 'chatbubbles',
      color: '#f72585',
      screen: 'SMS',
    },
    {
      title: 'QR Scanner',
      description: 'Scan QR codes for fraud detection',
      icon: 'qr-code',
      color: '#4cc9f0',
      screen: 'QR',
    },
    {
      title: 'Transaction Monitor',
      description: 'Monitor transaction anomalies',
      icon: 'card',
      color: '#fca311',
      screen: 'Transaction',
    },
    {
      title: 'Dashboard',
      description: 'View fraud analytics',
      icon: 'analytics',
      color: '#7209b7',
      screen: 'Dashboard',
    },
  ];

  const stats = [
    { label: '₹1000+ Crores', value: 'Annual Fraud Loss' },
    { label: '99.5%', value: 'Detection Accuracy' },
    { label: '360°', value: 'Fraud Coverage' },
    { label: '10M+', value: 'Target Users' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#4361ee', '#3a0ca3']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="shield" size={60} color="white" />
          <Text style={styles.headerTitle}>SafeGuard AI</Text>
          <Text style={styles.headerSubtitle}>
            India's First 360° AI-Powered Fraud Detection
          </Text>
        </View>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <Surface key={index} style={styles.statCard} elevation={2}>
            <Text style={styles.statNumber}>{stat.label}</Text>
            <Text style={styles.statLabel}>{stat.value}</Text>
          </Surface>
        ))}
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Detection Features</Text>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(feature.screen)}
            style={styles.featureCard}
          >
            <Card style={[styles.card, { borderLeftColor: feature.color }]}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Ionicons 
                    name={feature.icon} 
                    size={30} 
                    color={feature.color} 
                  />
                  <View style={styles.cardText}>
                    <Title style={styles.cardTitle}>{feature.title}</Title>
                    <Paragraph style={styles.cardDescription}>
                      {feature.description}
                    </Paragraph>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('SMS')}
            style={[styles.actionButton, { backgroundColor: '#f72585' }]}
            labelStyle={styles.actionButtonText}
          >
            Scan SMS
          </Button>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('QR')}
            style={[styles.actionButton, { backgroundColor: '#4cc9f0' }]}
            labelStyle={styles.actionButtonText}
          >
            Scan QR Code
          </Button>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Protecting India's Digital Future
        </Text>
        <Text style={styles.footerSubtext}>
          Built with ❤️ for fraud prevention
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 10,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 60) / 2,
    padding: 20,
    marginBottom: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4361ee',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  featuresContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  featureCard: {
    marginBottom: 15,
  },
  card: {
    borderRadius: 15,
    borderLeftWidth: 4,
    elevation: 2,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    marginLeft: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    padding: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 25,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});

export default HomeScreen;
