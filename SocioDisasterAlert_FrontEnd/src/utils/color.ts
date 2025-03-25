import { useMantineTheme } from '@mantine/core';

const colors = ['red', 'orange', 'yellow', 'teal', 'blue', 'cyan', 'grape'];

export function useGenerateColor() {
  const { colors: theme } = useMantineTheme();

  return (n: number) => {
    return theme[colors[n % colors.length]];
  };
}
