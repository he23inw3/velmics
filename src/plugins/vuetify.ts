import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const theme = {
  dark: false,
  colors: {
    primary: '#6200EA',
    secondary: '#03DAC6',
    accent: '#FF4081',
    error: '#F44336',
    warning: '#FB8C00',
    info: '#2196F3',
    success: '#4CAF50',
    background: '#F5F5F5',
    surface: '#FFFFFF',
  }
};

export const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: theme
    },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
      elevation: 1,
    },
    VCard: {
      elevation: 2,
      rounded: 'lg',
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable',
      rounded: 'lg',
    },
    VChip: {
      rounded: 'lg',
    },
    VAlert: {
      rounded: 'lg',
      border: 'start',
      elevation: 1,
    },
  },
});

export default vuetify;