import Navbar from "@/components/Navbar";
import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Header } from "./Header";

const meta = {
  title: "Components/Navbar",
  component: Navbar,
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Header>;


export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story  = {
  args: {
    isLoggedIn: false,
  },
};

export const LoggedIn: Story  = {
  args: {
    isLoggedIn: true,
  },
};

export const Loading = {
  args: {
    loading: true,
  },
};
