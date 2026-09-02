import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';
import { Text } from '../Text/Text';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md'],
    },
    variant: {
      control: 'inline-radio',
      options: ['solid', 'dashed', 'dotted'],
    },
    color: {
      control: 'select',
      options: ['subtle', 'default', 'accent', 'error'],
    },
    labelPosition: {
      control: 'inline-radio',
      options: ['left', 'center', 'right'],
    },
    label: { control: 'text' },
    margin: { control: 'text' },
  },
  args: {
    orientation: 'horizontal',
    size: 'sm',
    variant: 'solid',
    color: 'subtle',
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Divider {...args} variant="solid" />
      <Divider {...args} variant="dashed" />
      <Divider {...args} variant="dotted" />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Divider {...args} color="subtle" />
      <Divider {...args} color="default" />
      <Divider {...args} color="accent" />
      <Divider {...args} color="error" />
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Divider {...args} size="xs" />
      <Divider {...args} size="sm" />
      <Divider {...args} size="md" />
    </div>
  ),
};

export const WithLabel: Story = {
  args: { label: 'Или' },
};

export const LabelPositions: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Divider {...args} label="Слева" labelPosition="left" />
      <Divider {...args} label="Центр" labelPosition="center" />
      <Divider {...args} label="Справа" labelPosition="right" />
    </div>
  ),
};

export const Vertical: Story = {
  render: (args) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        height: 40,
      }}
    >
      <Text>Слева</Text>
      <Divider {...args} orientation="vertical" />
      <Text>Центр</Text>
      <Divider {...args} orientation="vertical" />
      <Text>Справа</Text>
    </div>
  ),
};

export const WithMargin: Story = {
  render: (args) => (
    <div>
      <Text>Первый блок</Text>
      <Divider {...args} margin={24} />
      <Text>Второй блок</Text>
    </div>
  ),
};

export const WithButtonLabel: Story = {
  render: (args) => (
    <Divider
      {...args}
      label={
        <Button variant="default" size="xs">
          Показать ещё
        </Button>
      }
    />
  ),
};

export const BetweenSections: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Text weight="medium">Настройки аккаунта</Text>
      <Text size="sm" color="dimmed">
        Управление профилем и безопасностью
      </Text>
      <Divider margin={8} />
      <Text weight="medium">Уведомления</Text>
      <Text size="sm" color="dimmed">
        Настройка push и email
      </Text>
      <Divider margin={8} />
      <Text weight="medium">Оплата</Text>
    </div>
  ),
};
