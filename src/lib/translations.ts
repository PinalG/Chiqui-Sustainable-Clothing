
export type AvailableLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh';

export type TranslationKey = 
  // Common UI elements
  | 'common.save'
  | 'common.cancel'
  | 'common.confirm'
  | 'common.close'
  | 'common.loading'
  | 'common.error'
  | 'common.success'
  | 'common.search'
  | 'common.back'
  | 'common.next'
  | 'common.submit'
  
  // Navigation
  | 'navigation.home'
  | 'navigation.donations'
  | 'navigation.marketplace'
  | 'navigation.dashboard'
  | 'navigation.settings'
  | 'navigation.login'
  | 'navigation.signup'
  | 'navigation.logout'
  | 'navigation.profile'
  
  // Auth
  | 'auth.email'
  | 'auth.password'
  | 'auth.confirmPassword' 
  | 'auth.displayName'
  | 'auth.login'
  | 'auth.signup'
  | 'auth.forgotPassword'
  | 'auth.loginSuccess'
  | 'auth.signupSuccess'
  | 'auth.logoutSuccess'
  | 'auth.resetPasswordSuccess'
  | 'auth.loginError'
  
  // Accessibility
  | 'accessibility.title'
  | 'accessibility.description'
  | 'accessibility.language'
  | 'accessibility.highContrast'
  | 'accessibility.highContrastDescription'
  | 'accessibility.largeText'
  | 'accessibility.largeTextDescription'
  | 'accessibility.reducedMotion'
  | 'accessibility.reducedMotionDescription'
  | 'accessibility.screenReaderOptimized'
  | 'accessibility.screenReaderOptimizedDescription'
  | 'accessibility.colorBlindFriendly'
  | 'accessibility.colorBlindFriendlyDescription'
  | 'accessibility.dyslexiaFriendly'
  | 'accessibility.dyslexiaFriendlyDescription'
  | 'accessibility.keyboardNavigation'
  | 'accessibility.saveSettings'
  | 'accessibility.preview'
  
  // Privacy
  | 'privacy.title'
  | 'privacy.description'
  | 'privacy.marketingConsent'
  | 'privacy.cookiesConsent'
  | 'privacy.dataSharingConsent'
  
  // Donations
  | 'donations.newDonation'
  | 'donations.donationSuccess'
  | 'donations.donationHistory'
  | 'donations.donationDetails'
  | 'donations.uploadImage'
  | 'donations.selectCategory'
  | 'donations.itemDescription'
  | 'donations.estimatedValue'
  | 'donations.shareYourDonation'
  
  // Social Sharing
  | 'social.shareOn'
  | 'social.shareOnFacebook'
  | 'social.shareOnTwitter'
  | 'social.shareOnWhatsApp'
  | 'social.shareOnLinkedIn'
  | 'social.shareMessage'
  | 'social.shareTitle'
  
  // Settings
  | 'settings.title'
  | 'settings.account'
  | 'settings.accessibility'
  | 'settings.privacy'
  | 'settings.notifications'
  | 'settings.security'
  | 'settings.saved';

// English translations (the base language)
const en = {
  // Common UI elements
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.close': 'Close',
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.success': 'Success',
  'common.search': 'Search',
  'common.back': 'Back',
  'common.next': 'Next',
  'common.submit': 'Submit',
  
  // Navigation
  'navigation.home': 'Home',
  'navigation.donations': 'Donations',
  'navigation.marketplace': 'Marketplace',
  'navigation.dashboard': 'Dashboard',
  'navigation.settings': 'Settings',
  'navigation.login': 'Log In',
  'navigation.signup': 'Sign Up',
  'navigation.logout': 'Log Out',
  'navigation.profile': 'Profile',
  
  // Auth
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.confirmPassword': 'Confirm Password',
  'auth.displayName': 'Full Name',
  'auth.login': 'Log In',
  'auth.signup': 'Sign Up',
  'auth.forgotPassword': 'Forgot Password?',
  'auth.loginSuccess': 'Logged in successfully',
  'auth.signupSuccess': 'Account created successfully',
  'auth.logoutSuccess': 'Logged out successfully',
  'auth.resetPasswordSuccess': 'Password reset email sent',
  'auth.loginError': 'Failed to log in',
  
  // Accessibility
  'accessibility.title': 'Accessibility & Language Settings',
  'accessibility.description': 'Customize your experience to meet your accessibility needs',
  'accessibility.language': 'Language',
  'accessibility.highContrast': 'High Contrast Mode',
  'accessibility.highContrastDescription': 'Enhances visual boundaries with greater contrast between elements',
  'accessibility.largeText': 'Large Text Mode',
  'accessibility.largeTextDescription': 'Increases the font size across the application for improved readability',
  'accessibility.reducedMotion': 'Reduced Motion',
  'accessibility.reducedMotionDescription': 'Minimizes animations and transitions throughout the interface',
  'accessibility.screenReaderOptimized': 'Screen Reader Optimized',
  'accessibility.screenReaderOptimizedDescription': 'Improves compatibility with screen readers and assistive technologies',
  'accessibility.colorBlindFriendly': 'Color Blind Friendly',
  'accessibility.colorBlindFriendlyDescription': 'Adjusts colors to be more distinguishable for those with color vision deficiencies',
  'accessibility.dyslexiaFriendly': 'Dyslexia Friendly Text',
  'accessibility.dyslexiaFriendlyDescription': 'Adjusts text spacing and font for easier reading for those with dyslexia',
  'accessibility.keyboardNavigation': 'Keyboard Navigation Tips',
  'accessibility.saveSettings': 'Save Settings',
  'accessibility.preview': 'Preview',
  
  // Privacy
  'privacy.title': 'Privacy Settings',
  'privacy.description': 'Manage your data privacy preferences',
  'privacy.marketingConsent': 'Receive marketing emails',
  'privacy.cookiesConsent': 'Allow cookies',
  'privacy.dataSharingConsent': 'Allow data sharing with partners',
  
  // Donations
  'donations.newDonation': 'New Donation',
  'donations.donationSuccess': 'Donation Successful',
  'donations.donationHistory': 'Donation History',
  'donations.donationDetails': 'Donation Details',
  'donations.uploadImage': 'Upload Image',
  'donations.selectCategory': 'Select Category',
  'donations.itemDescription': 'Item Description',
  'donations.estimatedValue': 'Estimated Value',
  'donations.shareYourDonation': 'Share Your Donation',
  
  // Social Sharing
  'social.shareOn': 'Share on',
  'social.shareOnFacebook': 'Share on Facebook',
  'social.shareOnTwitter': 'Share on Twitter',
  'social.shareOnWhatsApp': 'Share on WhatsApp',
  'social.shareOnLinkedIn': 'Share on LinkedIn',
  'social.shareMessage': 'I just donated through ACDRP! Join me in reducing waste and supporting sustainable fashion.',
  'social.shareTitle': 'Share Your Impact',
  
  // Settings
  'settings.title': 'Account Settings',
  'settings.account': 'Account',
  'settings.accessibility': 'Accessibility',
  'settings.privacy': 'Privacy',
  'settings.notifications': 'Notifications',
  'settings.security': 'Security',
  'settings.saved': 'Settings saved successfully'
};

// Spanish translations
const es = {
  // Common UI elements
  'common.save': 'Guardar',
  'common.cancel': 'Cancelar',
  'common.confirm': 'Confirmar',
  'common.close': 'Cerrar',
  'common.loading': 'Cargando...',
  'common.error': 'Error',
  'common.success': 'Éxito',
  'common.search': 'Buscar',
  'common.back': 'Atrás',
  'common.next': 'Siguiente',
  'common.submit': 'Enviar',
  
  // Navigation
  'navigation.home': 'Inicio',
  'navigation.donations': 'Donaciones',
  'navigation.marketplace': 'Mercado',
  'navigation.dashboard': 'Panel',
  'navigation.settings': 'Configuración',
  'navigation.login': 'Iniciar Sesión',
  'navigation.signup': 'Registrarse',
  'navigation.logout': 'Cerrar Sesión',
  'navigation.profile': 'Perfil',
  
  // Auth
  'auth.email': 'Correo Electrónico',
  'auth.password': 'Contraseña',
  'auth.confirmPassword': 'Confirmar Contraseña',
  'auth.displayName': 'Nombre Completo',
  'auth.login': 'Iniciar Sesión',
  'auth.signup': 'Registrarse',
  'auth.forgotPassword': '¿Olvidó su Contraseña?',
  'auth.loginSuccess': 'Sesión iniciada correctamente',
  'auth.signupSuccess': 'Cuenta creada correctamente',
  'auth.logoutSuccess': 'Sesión cerrada correctamente',
  'auth.resetPasswordSuccess': 'Correo de restablecimiento de contraseña enviado',
  'auth.loginError': 'Error al iniciar sesión',
  
  // Accessibility
  'accessibility.title': 'Configuración de Accesibilidad e Idioma',
  'accessibility.description': 'Personalice su experiencia para satisfacer sus necesidades de accesibilidad',
  'accessibility.language': 'Idioma',
  'accessibility.highContrast': 'Modo de Alto Contraste',
  'accessibility.highContrastDescription': 'Mejora los límites visuales con mayor contraste entre elementos',
  'accessibility.largeText': 'Modo de Texto Grande',
  'accessibility.largeTextDescription': 'Aumenta el tamaño de la fuente en toda la aplicación para mejorar la legibilidad',
  'accessibility.reducedMotion': 'Movimiento Reducido',
  'accessibility.reducedMotionDescription': 'Minimiza las animaciones y transiciones en toda la interfaz',
  'accessibility.screenReaderOptimized': 'Optimizado para Lectores de Pantalla',
  'accessibility.screenReaderOptimizedDescription': 'Mejora la compatibilidad con lectores de pantalla y tecnologías de asistencia',
  'accessibility.colorBlindFriendly': 'Adaptado para Daltonismo',
  'accessibility.colorBlindFriendlyDescription': 'Ajusta los colores para ser más distinguibles para aquellos con deficiencias en la visión del color',
  'accessibility.dyslexiaFriendly': 'Texto adaptado para Dislexia',
  'accessibility.dyslexiaFriendlyDescription': 'Ajusta el espaciado del texto y la fuente para facilitar la lectura a personas con dislexia',
  'accessibility.keyboardNavigation': 'Consejos de Navegación por Teclado',
  'accessibility.saveSettings': 'Guardar Configuración',
  'accessibility.preview': 'Vista Previa',
  
  // Privacy
  'privacy.title': 'Configuración de Privacidad',
  'privacy.description': 'Administre sus preferencias de privacidad de datos',
  'privacy.marketingConsent': 'Recibir correos electrónicos de marketing',
  'privacy.cookiesConsent': 'Permitir cookies',
  'privacy.dataSharingConsent': 'Permitir compartir datos con socios',
  
  // Donations
  'donations.newDonation': 'Nueva Donación',
  'donations.donationSuccess': 'Donación Exitosa',
  'donations.donationHistory': 'Historial de Donaciones',
  'donations.donationDetails': 'Detalles de la Donación',
  'donations.uploadImage': 'Subir Imagen',
  'donations.selectCategory': 'Seleccionar Categoría',
  'donations.itemDescription': 'Descripción del Artículo',
  'donations.estimatedValue': 'Valor Estimado',
  'donations.shareYourDonation': 'Comparte tu Donación',
  
  // Social Sharing
  'social.shareOn': 'Compartir en',
  'social.shareOnFacebook': 'Compartir en Facebook',
  'social.shareOnTwitter': 'Compartir en Twitter',
  'social.shareOnWhatsApp': 'Compartir en WhatsApp',
  'social.shareOnLinkedIn': 'Compartir en LinkedIn',
  'social.shareMessage': '¡Acabo de donar a través de ACDRP! Únete a mí para reducir residuos y apoyar la moda sostenible.',
  'social.shareTitle': 'Comparte tu Impacto',
  
  // Settings
  'settings.title': 'Configuración de la Cuenta',
  'settings.account': 'Cuenta',
  'settings.accessibility': 'Accesibilidad',
  'settings.privacy': 'Privacidad',
  'settings.notifications': 'Notificaciones',
  'settings.security': 'Seguridad',
  'settings.saved': 'Configuración guardada correctamente'
};

// French translations
const fr = {
  // Common UI elements
  'common.save': 'Enregistrer',
  'common.cancel': 'Annuler',
  'common.confirm': 'Confirmer',
  'common.close': 'Fermer',
  'common.loading': 'Chargement...',
  'common.error': 'Erreur',
  'common.success': 'Succès',
  'common.search': 'Rechercher',
  'common.back': 'Retour',
  'common.next': 'Suivant',
  'common.submit': 'Soumettre',
  
  // Navigation
  'navigation.home': 'Accueil',
  'navigation.donations': 'Dons',
  'navigation.marketplace': 'Marché',
  'navigation.dashboard': 'Tableau de Bord',
  'navigation.settings': 'Paramètres',
  'navigation.login': 'Connexion',
  'navigation.signup': 'Inscription',
  'navigation.logout': 'Déconnexion',
  'navigation.profile': 'Profil',
  
  // Additional translations would go here...
  // For brevity, only including partial translations for French
  
  // Accessibility
  'accessibility.title': 'Paramètres d\'Accessibilité et de Langue',
  'accessibility.description': 'Personnalisez votre expérience pour répondre à vos besoins d\'accessibilité',
  'accessibility.language': 'Langue',
  'accessibility.highContrast': 'Mode Contraste Élevé',
  'accessibility.largeText': 'Mode Texte Large',
  'accessibility.reducedMotion': 'Mouvement Réduit',
  'accessibility.screenReaderOptimized': 'Optimisé pour Lecteur d\'Écran',
  'accessibility.colorBlindFriendly': 'Adapté au Daltonisme',
  'accessibility.dyslexiaFriendly': 'Texte Adapté à la Dyslexie',
  
  // Settings
  'settings.title': 'Paramètres du Compte',
  'settings.accessibility': 'Accessibilité',
  'settings.privacy': 'Confidentialité'
};

// German translations
const de = {
  // Common UI elements
  'common.save': 'Speichern',
  'common.cancel': 'Abbrechen',
  'common.confirm': 'Bestätigen',
  'common.close': 'Schließen',
  'common.loading': 'Wird geladen...',
  'common.error': 'Fehler',
  'common.success': 'Erfolg',
  'common.search': 'Suchen',
  'common.back': 'Zurück',
  'common.next': 'Weiter',
  'common.submit': 'Absenden',
  
  // Navigation
  'navigation.home': 'Startseite',
  'navigation.donations': 'Spenden',
  'navigation.marketplace': 'Marktplatz',
  'navigation.dashboard': 'Dashboard',
  'navigation.settings': 'Einstellungen',
  'navigation.login': 'Anmelden',
  'navigation.signup': 'Registrieren',
  'navigation.logout': 'Abmelden',
  'navigation.profile': 'Profil',
  
  // Accessibility
  'accessibility.title': 'Barrierefreiheit & Spracheinstellungen',
  'accessibility.description': 'Passen Sie Ihre Erfahrung an Ihre Bedürfnisse zur Barrierefreiheit an',
  'accessibility.language': 'Sprache',
  'accessibility.highContrast': 'Hoher Kontrast Modus',
  'accessibility.largeText': 'Großer Text Modus',
  'accessibility.reducedMotion': 'Reduzierte Bewegung',
  'accessibility.screenReaderOptimized': 'Für Screenreader optimiert',
  'accessibility.colorBlindFriendly': 'Farbenblind-freundlich',
  'accessibility.dyslexiaFriendly': 'Dyslexie-freundlicher Text'
};

// Simplified Chinese translations
const zh = {
  // Common UI elements
  'common.save': '保存',
  'common.cancel': '取消',
  'common.confirm': '确认',
  'common.close': '关闭',
  'common.loading': '加载中...',
  'common.error': '错误',
  'common.success': '成功',
  'common.search': '搜索',
  'common.back': '返回',
  'common.next': '下一步',
  'common.submit': '提交',
  
  // Navigation
  'navigation.home': '首页',
  'navigation.donations': '捐赠',
  'navigation.marketplace': '市场',
  'navigation.dashboard': '仪表板',
  'navigation.settings': '设置',
  'navigation.login': '登录',
  'navigation.signup': '注册',
  'navigation.logout': '退出登录',
  'navigation.profile': '个人资料',
  
  // Accessibility
  'accessibility.title': '无障碍和语言设置',
  'accessibility.description': '自定义您的体验以满足您的无障碍需求',
  'accessibility.language': '语言',
  'accessibility.highContrast': '高对比度模式',
  'accessibility.largeText': '大文本模式',
  'accessibility.reducedMotion': '减少动画',
  'accessibility.screenReaderOptimized': '屏幕阅读器优化',
  'accessibility.colorBlindFriendly': '色盲友好',
  'accessibility.dyslexiaFriendly': '阅读障碍友好文本'
};

export const translations = {
  en,
  es,
  fr,
  de,
  zh
};
