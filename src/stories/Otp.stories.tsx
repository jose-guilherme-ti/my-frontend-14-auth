import type { Meta, StoryObj } from "@storybook/react";
import OtpInput from "../app/(protected)/otp_input/page";
import { fn } from "storybook/test";
import { ComponentProps } from "react";

type StoryProps = ComponentProps<typeof OtpInput>;

const meta: Meta<StoryProps> = {
  component: OtpInput,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ['primary', 'secondary'],
      control: {
        type: 'radio',
      },
    },
    backgroundColor: { control: 'color' },
    size: {
      options: ['sm', 'md', 'lg'],
      control: {
        type: 'select',
      },
    },
  },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Default: Story = {
   args: {
    variant: 'primary',
    size: 'md',
  },
  render: ({...args}) => <OtpInput {...args} />,
};
