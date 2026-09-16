import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Alert } from './Alert';
import { Button } from '../Button/Button';
import { Group } from '../Group/Group';
import { Stack } from '../Stack/Stack';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['info', 'success', 'warning', 'error'],
    },
    radius: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    withBorder: { control: 'boolean' },
    withCloseButton: { control: 'boolean' },
    title: { control: 'text' },
    children: { control: 'text' },
  },
  args: {
    variant: 'info',
    radius: 'md',
    withBorder: false,
    withCloseButton: false,
    title: 'Заголовок сообщения',
    children: 'Описание того, что произошло. Здесь может быть больше текста.',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <Stack gap="md">
      <Alert {...args} variant="info" title="Информация">
        Это нейтральное сообщение для пользователя.
      </Alert>
      <Alert {...args} variant="success" title="Успех">
        Данные успешно сохранены.
      </Alert>
      <Alert {...args} variant="warning" title="Внимание">
        Файл будет удалён через 24 часа.
      </Alert>
      <Alert {...args} variant="error" title="Ошибка">
        Не удалось подключиться к серверу.
      </Alert>
    </Stack>
  ),
};

export const WithBorder: Story = {
  render: (args) => (
    <Stack gap="md">
      <Alert {...args} withBorder variant="info" title="Информация">
        Это сообщение с рамкой.
      </Alert>
      <Alert {...args} withBorder variant="success" title="Успех">
        Данные успешно сохранены.
      </Alert>
      <Alert {...args} withBorder variant="warning" title="Внимание">
        Файл будет удалён.
      </Alert>
      <Alert {...args} withBorder variant="error" title="Ошибка">
        Не удалось подключиться.
      </Alert>
    </Stack>
  ),
};

export const OnlyTitle: Story = {
  args: { title: 'Только заголовок без описания' },
};

export const OnlyContent: Story = {
  args: { title: undefined, children: 'Только текст, без заголовка' },
};

export const WithClose: Story = {
  render: (args) => {
    const [visible, setVisible] = useState(true);
    if (!visible) {
      return <Button onClick={() => setVisible(true)}>Показать сообщение снова</Button>;
    }
    return (
      <Alert {...args} withCloseButton onClose={() => setVisible(false)} variant="info" title="Закрываемое сообщение">
        Нажмите × справа, чтобы закрыть.
      </Alert>
    );
  },
};

export const WithActions: Story = {
  render: (args) => (
    <Alert {...args} variant="warning" title="Удалить таблицу?">
      Это действие необратимо. Вы уверены?
      <Group gap="sm" style={{ marginTop: 12 }}>
        <Button size="xs" variant="warning">
          Удалить
        </Button>
        <Button size="xs" variant="default">
          Отмена
        </Button>
      </Group>
    </Alert>
  ),
};

export const CustomIcon: Story = {
  args: {
    icon: <span>🎉</span>,
    variant: 'success',
    title: 'Поздравляем!',
    children: 'Вы завершили настройку.',
  },
};

export const Radii: Story = {
  render: (args) => (
    <Stack gap="md">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((r) => (
        <Alert {...args} key={r} radius={r} title={`radius=${r}`}>
          Проверка скругления.
        </Alert>
      ))}
    </Stack>
  ),
};

export const LongContent: Story = {
  args: {
    variant: 'info',
    title: 'Подробное описание',
    children:
      'Это длинное сообщение, которое содержит несколько предложений. Оно показывает, как ведёт себя Alert с большим количеством текста. Текст переносится, иконка остаётся на месте, отступы сохраняются.',
  },
};

export const EmptyStateWithAction: Story = {
  render: () => (
    <Alert variant="info" title="Пока нет ни одной таблицы" icon={<span>📊</span>}>
      Создайте первую таблицу, чтобы начать работу.
      <Group gap="sm" style={{ marginTop: 12 }}>
        <Button size="xs" variant="accent">
          Создать таблицу
        </Button>
      </Group>
    </Alert>
  ),
};
