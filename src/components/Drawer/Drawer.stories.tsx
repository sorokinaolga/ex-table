import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Drawer } from './Drawer';
import { Button } from '../Button/Button';
import { Text } from '../Text/Text';
import { Stack } from '../Stack/Stack';
import { Group } from '../Group/Group';
import { Input } from '../Input/Input';
import { Textarea } from '../Textarea/Textarea';

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'inline-radio',
      options: ['left', 'right', 'top', 'bottom'],
    },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
    },
    radius: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    withCloseButton: { control: 'boolean' },
    withOverlay: { control: 'boolean' },
    closeOnClickOutside: { control: 'boolean' },
    closeOnEscape: { control: 'boolean' },
    trapFocus: { control: 'boolean' },
    lockScroll: { control: 'boolean' },
    overlayOpacity: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
    overlayBlur: { control: { type: 'range', min: 0, max: 20, step: 1 } },
  },
  args: {
    opened: false,
    onClose: () => {},
    position: 'right',
    title: 'Заголовок панели',
    size: 'md',
    radius: 'md',
    withCloseButton: true,
    withOverlay: true,
    closeOnClickOutside: true,
    closeOnEscape: true,
    trapFocus: true,
    lockScroll: true,
    overlayOpacity: 0.6,
    overlayBlur: 2,
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: React.ComponentProps<typeof Drawer>) => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button variant="accent" onClick={() => setOpened(true)}>
        Открыть панель
      </Button>
      <Drawer {...args} opened={opened} onClose={() => setOpened(false)}>
        <Text>Содержимое выезжающей панели. Клик по оверлею, Escape или крестик закрывают её.</Text>
      </Drawer>
    </>
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
};

export const Positions: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    const [position, setPosition] = useState<React.ComponentProps<typeof Drawer>['position']>('right');
    return (
      <>
        <Group gap="sm">
          {(['left', 'right', 'top', 'bottom'] as const).map((p) => (
            <Button
              key={p}
              size="sm"
              variant="default"
              onClick={() => {
                setPosition(p);
                setOpened(true);
              }}
            >
              {p}
            </Button>
          ))}
        </Group>
        <Drawer {...args} opened={opened} onClose={() => setOpened(false)} position={position} size={position === 'top' || position === 'bottom' ? 'sm' : 'md'} title={`Позиция: ${position}`}>
          <Text>Панель выезжает с позиции {position}.</Text>
        </Drawer>
      </>
    );
  },
};

export const Sizes: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    const [size, setSize] = useState<React.ComponentProps<typeof Drawer>['size']>('md');
    return (
      <>
        <Group gap="sm">
          {(['xs', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant="default"
              onClick={() => {
                setSize(s);
                setOpened(true);
              }}
            >
              {s}
            </Button>
          ))}
        </Group>
        <Drawer {...args} opened={opened} onClose={() => setOpened(false)} size={size} title={`Размер: ${size}`}>
          <Text>Ширина панели: {size}.</Text>
        </Drawer>
      </>
    );
  },
};

export const LeftPanel: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button variant="accent" onClick={() => setOpened(true)}>
          Открыть меню слева
        </Button>
        <Drawer {...args} opened={opened} onClose={() => setOpened(false)} position="left" title="Навигация" size="sm">
          <Stack gap="sm">
            <Button variant="default" fullWidth>
              Главная
            </Button>
            <Button variant="default" fullWidth>
              Мои таблицы
            </Button>
            <Button variant="default" fullWidth>
              Настройки
            </Button>
            <Button variant="default" fullWidth>
              Выход
            </Button>
          </Stack>
        </Drawer>
      </>
    );
  },
};

export const BottomSheet: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button variant="accent" onClick={() => setOpened(true)}>
          Открыть снизу
        </Button>
        <Drawer {...args} opened={opened} onClose={() => setOpened(false)} position="bottom" size="sm" title="Меню действий">
          <Stack gap="sm">
            <Text>Выберите действие:</Text>
            <Button variant="default" fullWidth>
              Открыть
            </Button>
            <Button variant="default" fullWidth>
              Скачать
            </Button>
            <Button variant="default" fullWidth>
              Поделиться
            </Button>
          </Stack>
        </Drawer>
      </>
    );
  },
};

export const FormPanel: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button variant="accent" onClick={() => setOpened(true)}>
          Редактировать профиль
        </Button>
        <Drawer
          {...args}
          opened={opened}
          onClose={() => setOpened(false)}
          title="Профиль"
          size="md"
          footer={
            <>
              <Button variant="default" onClick={() => setOpened(false)}>
                Отмена
              </Button>
              <Button variant="accent" onClick={() => setOpened(false)}>
                Сохранить
              </Button>
            </>
          }
        >
          <Stack gap="md">
            <Input label="Имя" defaultValue="Иван Петров" />
            <Input label="Email" defaultValue="ivan@example.com" />
            <Textarea label="О себе" placeholder="Пара слов о себе…" autosize minRows={3} maxRows={6} />
          </Stack>
        </Drawer>
      </>
    );
  },
};

export const WithoutOverlay: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button variant="accent" onClick={() => setOpened(true)}>
          Без оверлея
        </Button>
        <Drawer {...args} opened={opened} onClose={() => setOpened(false)} withOverlay={false} title="Панель без оверлея">
          <Text>Фон не затемнён, можно взаимодействовать с контентом позади (если разрешено).</Text>
        </Drawer>
      </>
    );
  },
};

export const NoCloseButton: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button variant="accent" onClick={() => setOpened(true)}>
          Без крестика
        </Button>
        <Drawer
          {...args}
          opened={opened}
          onClose={() => setOpened(false)}
          withCloseButton={false}
          title="Закрыть только кнопкой"
          footer={
            <Button variant="accent" onClick={() => setOpened(false)}>
              Готово
            </Button>
          }
        >
          <Text>Закрыть можно кнопкой внизу или Escape.</Text>
        </Drawer>
      </>
    );
  },
};

export const LongContent: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button variant="accent" onClick={() => setOpened(true)}>
          Длинное содержимое
        </Button>
        <Drawer {...args} opened={opened} onClose={() => setOpened(false)} title="Длинный список">
          <Stack gap="sm">
            {Array.from({ length: 50 }, (_, i) => (
              <Text key={i}>Элемент #{i + 1}</Text>
            ))}
          </Stack>
        </Drawer>
      </>
    );
  },
};
