import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Popover } from './Popover';
import { Button } from '../Button/Button';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Text } from '../Text/Text';
import { Title } from '../Title/Title';
import { Stack } from '../Stack/Stack';
import { Group } from '../Group/Group';
import { Textarea } from '../Textarea/Textarea';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 80 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'],
    },
    withArrow: { control: 'boolean' },
    closeOnClickOutside: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    closeOnClickInside: { control: 'boolean' },
    trapFocus: { control: 'boolean' },
    shadow: {
      control: 'inline-radio',
      options: ['none', 'sm', 'md', 'lg'],
    },
    radius: {
      control: 'inline-radio',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    content: <Text>Содержимое поповера</Text>,
    position: 'bottom',
    withArrow: false,
    closeOnClickOutside: true,
    closeOnEscape: true,
    closeOnClickInside: false,
    trapFocus: false,
    shadow: 'md',
    radius: 'lg',
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Popover {...args}>
      <Button variant="accent">Открыть поповер</Button>
    </Popover>
  ),
};

export const WithArrow: Story = {
  args: { withArrow: true },
  render: (args) => (
    <Popover {...args}>
      <Button variant="accent">Со стрелкой</Button>
    </Popover>
  ),
};

export const Positions: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 24,
        placeItems: 'center',
        padding: 80,
      }}
    >
      {(['top-start', 'top', 'top-end', 'right', 'left', 'bottom-start', 'bottom', 'bottom-end'] as const).map((p) => (
        <Popover key={p} {...args} position={p} withArrow content={<Text size="sm">Позиция: {p}</Text>}>
          <Button size="sm" variant="default">
            {p}
          </Button>
        </Popover>
      ))}
    </div>
  ),
};

export const WithForm: Story = {
  render: (args) => (
    <Popover
      {...args}
      trapFocus
      width={320}
      content={
        <Stack gap="sm">
          <Title order={4} size="sm">
            Оставить комментарий
          </Title>
          <Textarea placeholder="Ваш комментарий…" autosize minRows={2} maxRows={4} />
          <Group gap="sm" justify="flex-end">
            <Button size="xs" variant="default">
              Отмена
            </Button>
            <Button size="xs" variant="accent">
              Отправить
            </Button>
          </Group>
        </Stack>
      }
    >
      <Button variant="default">Комментарий</Button>
    </Popover>
  ),
};

export const IconTrigger: Story = {
  render: () => (
    <Popover
      withArrow
      content={
        <Stack gap="xs" style={{ minWidth: 200 }}>
          <Text weight="medium">Настройки таблицы</Text>
          <Text size="sm" color="dimmed">
            Здесь будут настройки: приватность, доступ, экспорт.
          </Text>
        </Stack>
      }
    >
      <ButtonIcon variant="subtle" shape="circle" aria-label="Настройки">
        ⚙️
      </ButtonIcon>
    </Popover>
  ),
};

export const Controlled: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    return (
      <Stack gap="md" align="center">
        <Popover
          {...args}
          opened={opened}
          onChange={setOpened}
          content={
            <Stack gap="sm" style={{ minWidth: 200 }}>
              <Text size="sm">Управляется снаружи. Состояние: {opened ? 'открыт' : 'закрыт'}</Text>
              <Button size="xs" variant="default" onClick={() => setOpened(false)}>
                Закрыть изнутри
              </Button>
            </Stack>
          }
        >
          <Button variant="accent">Открыть</Button>
        </Popover>
      </Stack>
    );
  },
};

export const CloseOnClickInside: Story = {
  render: (args) => (
    <Popover
      {...args}
      closeOnClickInside
      content={
        <Stack gap="sm" style={{ minWidth: 180 }}>
          <Text size="sm">Нажми на любой пункт — поповер закроется.</Text>
          <Button size="xs" variant="accent">
            Пункт 1
          </Button>
          <Button size="xs" variant="accent">
            Пункт 2
          </Button>
          <Button size="xs" variant="accent">
            Пункт 3
          </Button>
        </Stack>
      }
    >
      <Button variant="default">Меню-подобный поповер</Button>
    </Popover>
  ),
};

export const FilterPopover: Story = {
  render: () => (
    <Popover
      withArrow
      width={280}
      content={
        <Stack gap="sm">
          <Text weight="medium">Фильтры</Text>
          <Textarea placeholder="Поиск по названию…" />
          <Group gap="xs">
            <Button size="xs" variant="default">
              Активные
            </Button>
            <Button size="xs" variant="default">
              Черновики
            </Button>
            <Button size="xs" variant="default">
              Архив
            </Button>
          </Group>
          <Group gap="sm" justify="flex-end" style={{ marginTop: 4 }}>
            <Button size="xs" variant="default">
              Сбросить
            </Button>
            <Button size="xs" variant="accent">
              Применить
            </Button>
          </Group>
        </Stack>
      }
    >
      <Button variant="default" leftSection={<span>🔍</span>}>
        Фильтры
      </Button>
    </Popover>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Popover {...args}>
      <Button variant="default">Отключён</Button>
    </Popover>
  ),
};
