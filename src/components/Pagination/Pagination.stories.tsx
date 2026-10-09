import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';
import { Text } from '../Text/Text';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    total: { control: { type: 'number', min: 1, max: 100 } },
    defaultValue: { control: { type: 'number', min: 1, max: 100 } },
    siblings: { control: { type: 'number', min: 0, max: 3 } },
    boundaries: { control: { type: 'number', min: 0, max: 3 } },
    withEdges: { control: 'boolean' },
    withControls: { control: 'boolean' },
    size: {
      control: 'inline-radio',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['accent', 'warning', 'error', 'default'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    total: 20,
    defaultValue: 10,
    siblings: 1,
    boundaries: 1,
    withControls: true,
    withEdges: false,
    size: 'md',
    color: 'accent',
    disabled: false,
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FewPages: Story = {
  args: { total: 5, defaultValue: 3 },
};

export const ManyPages: Story = {
  args: { total: 50, defaultValue: 25 },
};

export const NoSiblings: Story = {
  args: { siblings: 0, total: 20, defaultValue: 10 },
};

export const ManySiblings: Story = {
  args: { siblings: 3, total: 50, defaultValue: 25 },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
        <div key={s}>
          <Text size="xs" color="muted" style={{ marginBottom: 4 }}>
            size={s}
          </Text>
          <Pagination {...args} size={s} />
        </div>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      {(['accent', 'warning', 'error', 'default'] as const).map((c) => (
        <div key={c}>
          <Text size="xs" color="muted" style={{ marginBottom: 4 }}>
            color={c}
          </Text>
          <Pagination {...args} color={c} />
        </div>
      ))}
    </div>
  ),
};

export const WithoutControls: Story = {
  args: { withControls: false },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Controlled: Story = {
  render: (args) => {
    const [page, setPage] = useState(5);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Pagination {...args} value={page} onChange={setPage} />
        <Text size="sm" color="muted">
          Страница: {page}
        </Text>
      </div>
    );
  },
};

export const CustomDots: Story = {
  args: {
    total: 50,
    defaultValue: 25,
    dotsIcon: <span style={{ fontSize: '1.2em', color: 'var(--theme-muted)' }}>…</span>,
  },
};

export const TablePagination: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const totalPages = 15;
    const itemsPerPage = 10;
    const totalItems = totalPages * itemsPerPage;

    return (
      <div style={{ width: 600 }}>
        <div
          style={{
            padding: 16,
            background: 'var(--theme-surface)',
            border: '1px solid var(--theme-border-subtle)',
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Text size="sm" color="muted">
            Показано {(page - 1) * itemsPerPage + 1}—{page * itemsPerPage} из {totalItems} записей
          </Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text size="sm" color="muted">
            Страница {page} из {totalPages}
          </Text>
          <Pagination total={totalPages} value={page} onChange={setPage} />
        </div>
      </div>
    );
  },
};

export const CompactView: Story = {
  render: () => {
    const [page, setPage] = useState(3);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Pagination total={10} value={page} onChange={setPage} size="sm" siblings={0} boundaries={1} color="default" />
        <Text size="sm" color="muted">
          {page} / 10
        </Text>
      </div>
    );
  },
};
