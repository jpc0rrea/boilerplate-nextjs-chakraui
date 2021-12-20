import { mode } from '@chakra-ui/theme-tools';
import { extendTheme } from '@chakra-ui/react';
import { Dict } from '@chakra-ui/utils';

export const theme = extendTheme({
  colors: {
    brand: {
      backgroundGray: '#403F4C',
      lightGray: '#D9D9D9',
      yellow: '#F9DC5C',
      blue: '#3185FC',
      red: '#E84855',
    },
    gray: {
      '900': '#161C24',
      '800': '#212B36',
      '700': '#454F5B',
      '600': '#637381',
      '500': '#919EAB',
      '400': '#C4CDD5',
      '300': '#DFE3E8',
      '200': '#F4F6F8',
      '100': '#F9FAFB',
    },
  },
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Fira Code',
  },
  styles: {
    global: (props: Dict<unknown>) => ({
      body: {
        bg: mode('gray.100', 'brand.backgroundGray')(props),
        color: mode('gray.900', 'gray.100')(props),
      },
    }),
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});
