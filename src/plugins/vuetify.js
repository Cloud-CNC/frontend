//Imports
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'md'
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#4CAF50',
        secondary: '#66BB6A',
        accent: '#448AFF'
      },
      light: {
        primary: '#2196F3',
        secondary: '#64B5F6',
        accent: '#448AFF'
      }
    }
  }
});
