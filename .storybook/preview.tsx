import type { Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
import { ThemeProvider, useTheme } from '../src/theme';
import '../src/theme/theme.css';

function ThemeSync({ scheme }: { scheme: 'light' | 'dark' }) {
  const { setColorScheme } = useTheme();
  useEffect(() => {
    setColorScheme(scheme);
  }, [scheme, setColorScheme]);
  return null;
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color scheme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const scheme = (context.globals.theme ?? 'light') as 'light' | 'dark';
      return (
        <ThemeProvider>
          <ThemeSync scheme={scheme} />
          <Story />
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
