import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Group } from '../Group/Group';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end'],
    },
    withArrow: { control: 'boolean' },
    multiline: { control: 'boolean' },
    disabled: { control: 'boolean' },
    openDelay: { control: 'number' },
    closeDelay: { control: 'number' },
    offset: { control: 'number' },
    maw: { control: 'number' },
  },
  args: {
    label: 'Это подсказка',
    position: 'top',
    withArrow: false,
    openDelay: 0,
    closeDelay: 100,
    offset: 8,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="default">Наведи на меня</Button>
    </Tooltip>
  ),
};

export const WithArrow: Story = {
  args: { withArrow: true },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="accent">Со стрелкой</Button>
    </Tooltip>
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
        <Tooltip key={p} {...args} position={p} withArrow label={p}>
          <Button size="sm" variant="default">
            {p}
          </Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Multiline: Story = {
  args: {
    multiline: true,
    maw: 200,
    label: 'Это многострочная подсказка, которая переносится на несколько строк.',
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="default">Многострочная</Button>
    </Tooltip>
  ),
};

export const WithDelay: Story = {
  args: { openDelay: 500, closeDelay: 300 },
  render: (args) => (
    <Tooltip {...args} label="Открывается через 500ms">
      <Button variant="default">С задержкой</Button>
    </Tooltip>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="default">Не показывается</Button>
    </Tooltip>
  ),
};

export const OnButtonIcon: Story = {
  render: () => (
    <Group gap="md">
      <Tooltip label="Настройки" withArrow>
        <ButtonIcon variant="subtle" shape="circle">
          ⚙️
        </ButtonIcon>
      </Tooltip>
      <Tooltip label="Удалить" withArrow>
        <ButtonIcon variant="subtle" shape="circle" color="error">
          🗑️
        </ButtonIcon>
      </Tooltip>
      <Tooltip label="Поделиться" withArrow>
        <ButtonIcon variant="subtle" shape="circle">
          🔗
        </ButtonIcon>
      </Tooltip>
    </Group>
  ),
};

export const OnLongText: Story = {
  render: () => (
    <Tooltip label="Полное название таблицы" withArrow multiline maw={300}>
      <span
        style={{
          display: 'inline-block',
          maxWidth: 120,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          borderBottom: '1px dashed var(--theme-border)',
          cursor: 'help',
        }}
      >
        Очень длинное название…
      </span>
    </Tooltip>
  ),
};

export const KeyboardAccessible: Story = {
  render: () => (
    <Tooltip label="Tab → фокус → тултип" withArrow>
      <Button variant="accent">Tab до меня</Button>
    </Tooltip>
  ),
};

export const ScrollDoesNotBreak: Story = {
  render: () => (
    <div style={{ height: 200, overflow: 'auto', width: 300 }}>
      <div style={{ height: 600, padding: 40 }}>
        <Tooltip label="Я не «уезжаю» при скролле" withArrow>
          <Button variant="accent">Прокрути меня</Button>
        </Tooltip>
      </div>
    </div>
  ),
};
