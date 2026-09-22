import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../Button/Button';
import { Text } from '../Text/Text';
import { Stack } from '../Stack/Stack';
import { Group } from '../Group/Group';
import { Input } from '../Input/Input';
import { Textarea } from '../Textarea/Textarea';
import { Checkbox } from '../Checkbox/Checkbox';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
    },
    radius: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    shadow: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    centered: { control: 'boolean' },
    fullScreen: { control: 'boolean' },
    withCloseButton: { control: 'boolean' },
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
    title: 'Заголовок модалки',
    size: 'md',
    radius: 'lg',
    shadow: 'lg',
    centered: false,
    fullScreen: false,
    withCloseButton: true,
    closeOnClickOutside: true,
    closeOnEscape: true,
    trapFocus: true,
    lockScroll: true,
    overlayOpacity: 0.6,
    overlayBlur: 2,
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

const Template = (args: React.ComponentProps<typeof Modal>) => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button variant="accent" onClick={() => setOpened(true)}>
        Открыть модалку
      </Button>
      <Modal {...args} opened={opened} onClose={() => setOpened(false)}>
        <Text>Это содержимое модалки. Клик по оверлею, Escape или крестик закрывают её.</Text>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: (args) => <Template {...args} />,
};

export const Sizes: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    const [size, setSize] = useState<React.ComponentProps<typeof Modal>['size']>('md');
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
        <Modal {...args} opened={opened} onClose={() => setOpened(false)} size={size}>
          <Text>Размер: {size}</Text>
        </Modal>
      </>
    );
  },
};

export const Centered: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button variant="accent" onClick={() => setOpened(true)}>
          Открыть по центру
        </Button>
        <Modal {...args} opened={opened} onClose={() => setOpened(false)} centered title="Модалка по центру">
          <Text>Она центрирована по вертикали.</Text>
        </Modal>
      </>
    );
  },
};

export const ConfirmDialog: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button variant="warning" onClick={() => setOpened(true)}>
          Удалить таблицу
        </Button>
        <Modal
          {...args}
          opened={opened}
          onClose={() => setOpened(false)}
          size="sm"
          centered
          title="Удалить таблицу?"
          footer={
            <>
              <Button variant="default" onClick={() => setOpened(false)}>
                Отмена
              </Button>
              <Button
                variant="warning"
                onClick={() => {
                  alert('Удалено');
                  setOpened(false);
                }}
              >
                Удалить
              </Button>
            </>
          }
        >
          <Text size="sm">Это действие необратимо. Все данные таблицы будут потеряны.</Text>
        </Modal>
      </>
    );
  },
};

export const FormDialog: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button variant="accent" onClick={() => setOpened(true)}>
          Создать таблицу
        </Button>
        <Modal
          {...args}
          opened={opened}
          onClose={() => setOpened(false)}
          title="Новая таблица"
          size="md"
          centered
          footer={
            <>
              <Button variant="default" onClick={() => setOpened(false)}>
                Отмена
              </Button>
              <Button variant="accent" onClick={() => setOpened(false)}>
                Создать
              </Button>
            </>
          }
        >
          <Stack gap="md">
            <Input label="Название" placeholder="Моя таблица" />
            <Textarea label="Описание" placeholder="Краткое описание…" autosize minRows={2} maxRows={4} />
            <Checkbox label="Поделиться с командой" />
          </Stack>
        </Modal>
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
          Открыть без крестика
        </Button>
        <Modal
          {...args}
          opened={opened}
          onClose={() => setOpened(false)}
          withCloseButton={false}
          centered
          title="Без крестика"
          footer={
            <Button variant="accent" onClick={() => setOpened(false)}>
              Закрыть
            </Button>
          }
        >
          <Text>Закрыть можно только кнопкой внизу или Escape.</Text>
        </Modal>
      </>
    );
  },
};

export const FullScreen: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button variant="accent" onClick={() => setOpened(true)}>
          На весь экран
        </Button>
        <Modal {...args} opened={opened} onClose={() => setOpened(false)} fullScreen title="Полноэкранная модалка">
          <Text>Занимает весь экран. Полезна для сложных форм или просмотра изображений.</Text>
        </Modal>
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
          Открыть с длинным контентом
        </Button>
        <Modal {...args} opened={opened} onClose={() => setOpened(false)} centered title="Длинный контент">
          <Stack gap="md">
            {Array.from({ length: 20 }, (_, i) => (
              <Text key={i}>Параграф #{i + 1}. Если контент выше экрана, скролл появляется внутри модалки, а body остаётся заблокированным.</Text>
            ))}
          </Stack>
        </Modal>
      </>
    );
  },
};

export const TransparentOverlay: Story = {
  render: (args) => {
    const [opened, setOpened] = useState(false);
    return (
      <>
        <Button variant="accent" onClick={() => setOpened(true)}>
          Оверлей с blur
        </Button>
        <Modal {...args} opened={opened} onClose={() => setOpened(false)} centered overlayOpacity={0.3} overlayBlur={8} title="Размытый оверлей">
          <Text>Фон размыт, оверлей полупрозрачный.</Text>
        </Modal>
      </>
    );
  },
};
