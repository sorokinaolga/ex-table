import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loader } from './Loader';
import { Button } from '../Button/Button';
import { Center } from '../Center/Center';
import { Text } from '../Text/Text';

const meta = {
  title: 'Components/Loader',
  component: Loader,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['oval', 'dots', 'bars'],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['accent', 'default', 'warning', 'error', 'inherit'],
    },
    fullWidth: { control: 'boolean' },
  },
  args: {
    variant: 'oval',
    size: 'md',
    color: 'accent',
    fullWidth: false,
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      <Loader {...args} variant="oval" />
      <Loader {...args} variant="dots" />
      <Loader {...args} variant="bars" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Loader {...args} size="xs" />
      <Loader {...args} size="sm" />
      <Loader {...args} size="md" />
      <Loader {...args} size="lg" />
      <Loader {...args} size="xl" />
    </div>
  ),
};

export const SizesDots: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Loader {...args} variant="dots" size="xs" />
      <Loader {...args} variant="dots" size="sm" />
      <Loader {...args} variant="dots" size="md" />
      <Loader {...args} variant="dots" size="lg" />
      <Loader {...args} variant="dots" size="xl" />
    </div>
  ),
};

export const SizesBars: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Loader {...args} variant="bars" size="xs" />
      <Loader {...args} variant="bars" size="sm" />
      <Loader {...args} variant="bars" size="md" />
      <Loader {...args} variant="bars" size="lg" />
      <Loader {...args} variant="bars" size="xl" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Loader {...args} color="accent" />
      <Loader {...args} color="default" />
      <Loader {...args} color="warning" />
      <Loader {...args} color="error" />
    </div>
  ),
};

export const InlineWithText: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Loader size="sm" />
      <Text>Загрузка данных…</Text>
    </div>
  ),
};

export const FullWidthCentered: Story = {
  render: () => (
    <div style={{ width: 320, height: 160, background: 'var(--theme-bg-subtle)' }}>
      <Center fullWidth fullHeight>
        <Loader size="lg" />
      </Center>
    </div>
  ),
};

export const InsideButton: Story = {
  render: () => (
    <Button variant="accent" leftSection={<Loader size="xs" color="inherit" />}>
      Отправка…
    </Button>
  ),
};

export const DifferentSizesInButton: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="accent" size="xs" leftSection={<Loader size="xs" color="inherit" />}>
        xs
      </Button>
      <Button variant="accent" size="sm" leftSection={<Loader size="xs" color="inherit" />}>
        sm
      </Button>
      <Button variant="accent" size="md" leftSection={<Loader size="sm" color="inherit" />}>
        md
      </Button>
    </div>
  ),
};

export const LoadingContent: Story = {
  render: () => (
    <div
      style={{
        width: 320,
        padding: 24,
        background: 'var(--theme-surface)',
        border: '1px solid var(--theme-border-subtle)',
        borderRadius: 8,
      }}
    >
      <Center fullWidth style={{ minHeight: 120 }}>
        <div style={{ textAlign: 'center' }}>
          <Loader variant="dots" size="lg" />
          <Text size="sm" color="dimmed" style={{ marginTop: 12 }}>
            Загружаем таблицы…
          </Text>
        </div>
      </Center>
    </div>
  ),
};
