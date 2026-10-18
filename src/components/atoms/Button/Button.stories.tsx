import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';
import { ArrowRight, Download, Trash } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'danger']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Explore Dashboard',
    variant: 'primary',
    size: 'md'
  }
};

export const WithIcon: Story = {
  args: {
    children: 'Download Report',
    variant: 'secondary',
    icon: <Download size={16} />,
    iconPosition: 'left'
  }
};

export const LoadingState: Story = {
  args: {
    children: 'Processing Ingestion...',
    loading: true
  }
};
