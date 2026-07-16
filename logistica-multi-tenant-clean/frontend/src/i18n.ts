import { useEffect, useState } from 'react';

type Language = 'pt' | 'en' | 'es';

const STORAGE_KEY = 'tranzor-lang';

export const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'pt';
  const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
  return stored === 'en' || stored === 'es' ? stored : 'pt';
};

export const setStoredLanguage = (lang: Language) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  window.dispatchEvent(new Event('tranzor-language-change'));
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());

  useEffect(() => {
    const update = () => setLanguage(getStoredLanguage());
    update();
    window.addEventListener('tranzor-language-change', update);
    return () => window.removeEventListener('tranzor-language-change', update);
  }, []);

  return { language, setLanguage: (lang: Language) => { setStoredLanguage(lang); setLanguage(lang); } };
};

export const translateText = (text: Record<string, string>, language: Language) => {
  return text[language] || text.pt || '';
};

export const TRANSLATIONS = {
  dashboardTitle:      { pt: 'Relatório de Performance', en: 'Performance Report', es: 'Informe de rendimiento' },
  dashboardSubtitle:   { pt: 'Visão geral do sistema logístico', en: 'Logistics system overview', es: 'Resumen del sistema logístico' },
  last30Days:          { pt: 'Últimos 30 dias', en: 'Last 30 days', es: 'Últimos 30 días' },
  exportReport:        { pt: 'Exportar Relatório', en: 'Export Report', es: 'Exportar informe' },
  distributionByStatus:{ pt: 'Distribuição por Estado', en: 'Distribution by Status', es: 'Distribución por estado' },
  productsByStatus:    { pt: 'Produtos por estado atual', en: 'Products by current status', es: 'Productos por estado actual' },
  noDataDisplay:       { pt: 'Sem dados para mostrar', en: 'No data to display', es: 'No hay datos para mostrar' },
  dashboardHeader:     { pt: 'Painel', en: 'Dashboard', es: 'Tablero' },
  headerProducts:      { pt: 'Produtos', en: 'Products', es: 'Productos' },
  headerTransports:    { pt: 'Transportes', en: 'Transports', es: 'Transportes' },
  headerSuppliers:     { pt: 'Fornecedores', en: 'Suppliers', es: 'Proveedores' },
  headerTracking:      { pt: 'Rastreamento', en: 'Tracking', es: 'Rastreo' },
  headerTasks:         { pt: 'Tarefas', en: 'Tasks', es: 'Tareas' },
  headerHistory:       { pt: 'Histórico', en: 'History', es: 'Historial' },
  headerVehicles:      { pt: 'Veículos', en: 'Vehicles', es: 'Vehículos' },
  headerCompanies:     { pt: 'Empresas', en: 'Companies', es: 'Empresas' },
  headerProfile:       { pt: 'Perfil', en: 'Profile', es: 'Perfil' },
  headerSettings:      { pt: 'Configurações', en: 'Settings', es: 'Configuración' },
  headerLogout:        { pt: 'Sair', en: 'Log out', es: 'Salir' },
  themeToggleTitle:         { pt: 'Alternar tema', en: 'Toggle theme', es: 'Alternar tema' },
  notificationsTitle:       { pt: 'Notificações', en: 'Notifications', es: 'Notificaciones' },
  clearAllNotificationsConfirm: { pt: 'Limpar todas as notificações?', en: 'Clear all notifications?', es: '¿Borrar todas las notificaciones?' },
  viewAllProducts:          { pt: 'Ver todos os produtos', en: 'View all products', es: 'Ver todos los productos' },
  noNotifications:          { pt: 'Sem notificações!', en: 'No notifications!', es: '¡Sin notificaciones!' },
  notificationsEmptyInfo:   { pt: 'Tudo funcionando bem', en: 'Everything is running smoothly', es: 'Todo funciona bien' },
  markAsReadTitle:          { pt: 'Marcar como lida', en: 'Mark as read', es: 'Marcar como leída' },
  userMenuTitle:            { pt: 'Menu do utilizador', en: 'User menu', es: 'Menú de usuario' },
  footerPrivacy:            { pt: 'Privacidade', en: 'Privacy', es: 'Privacidad' },
  footerTerms:         { pt: 'Termos', en: 'Terms', es: 'Términos' },
  footerContact:       { pt: 'Contacto', en: 'Contact', es: 'Contacto' },
  menuOpen:            { pt: 'Abrir barra lateral', en: 'Open sidebar', es: 'Abrir barra lateral' },
  menuClose:           { pt: 'Fechar barra lateral', en: 'Close sidebar', es: 'Cerrar barra lateral' },
};
