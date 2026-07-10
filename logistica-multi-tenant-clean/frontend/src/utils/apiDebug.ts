import api from '../api/api';
import { apiClient } from '../api/config';

export const debugApi = async () => {
  console.log('🔧 DEBUG API - Starting diagnostic...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Check api instance
  console.log('📡 API Instance (api.ts):');
  console.log('  Base URL:', api.defaults.baseURL);
  console.log('  Timeout:', api.defaults.timeout);
  
  // Check apiClient instance
  console.log('\n📡 API Client Instance (config.ts):');
  console.log('  Base URL:', apiClient.defaults.baseURL);
  
  // Check localStorage
  console.log('\n💾 LocalStorage:');
  console.log('  Token:', localStorage.getItem('token') ? ' Set' : ' Missing');
  console.log('  User:', localStorage.getItem('user') ? ' Set' : ' Missing');
  
  // Try to call health check or simple GET
  try {
    console.log('\n🌐 Testing API Connectivity...');
    const response = await api.get('/api/health').catch(() => 
      api.get('/').catch(() => 
        Promise.reject('No endpoint available for testing')
      )
    );
    console.log('   API is reachable');
    console.log('  Response:', response.data);
  } catch (error: any) {
    console.log('  ⚠️ Could not reach API (this might be normal if no health endpoint exists)');
    console.log('  Error:', error.message);
  }
  
  // Test login endpoint
  try {
    console.log('\n Testing Login Endpoint...');
    const response = await api.post('/auth/login', {
      email: 'test@test.com',
      password: 'test'
    });
    console.log('  Status:', response.status);
    console.log('  Date:', response.data);
  } catch (error: any) {
    console.log('  Expected error (invalid credentials)');
    console.log('  Status:', error.response?.status);
    console.log('  Message:', error.response?.data?.message || error.message);
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔧 DEBUG API - Diagnostic complete');
};

export const debugLogin = async (email: string, password: string) => {
  console.log('🔧 DEBUG LOGIN - Attempting login...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Email:', email);
  console.log('  Password:', password.substring(0, 1) + '*'.repeat(password.length - 1));
  console.log('  API Base URL:', api.defaults.baseURL);
  console.log('  Full URL:', api.defaults.baseURL + '/auth/login');
  
  try {
    const response = await api.post('/auth/login', { email, password });
    console.log(' SUCCESS:');
    console.log('  Status:', response.status);
    console.log('  Token:', response.data?.token ? ' Received' : ' Missing');
    console.log('  User:', response.data?.user ? ' Received' : ' Missing');
    console.log('  Full response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(' FAILED:');
    console.error('  Status:', error.response?.status);
    console.error('  Error:', error.response?.data?.message || error.message);
    console.error('  Full error date:', error.response?.data);
    throw error;
  }
};
