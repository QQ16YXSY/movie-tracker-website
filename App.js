/**
 * 应用入口文件
 * 初始化数据并渲染导航
 */

import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { storage } from './src/utils/storage';

export default function App() {
  useEffect(() => {
    const init = async () => {
      await storage.initData();
    };
    init();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
