import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';

import Stack from '@/components/Stack';

type StoryProps = ComponentProps<typeof Stack> & {
    numberOfChildren: number;
};

const meta: Meta<StoryProps> = {
    component: Stack,
    tags: ['autodocs'],
    argTypes: {
        numberOfChildren: {
            options: [1, 5, 10],
            control: {
                type: 'radio',
            },
        },
        orientation: {
            options: ['horizontal', 'vertical'],
            control: {
                type: 'select',
            },
        },
    },
    args: {
        numberOfChildren: 5,
    },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Horizontal: Story = {
    args: {
        orientation: 'horizontal',
    },
    render: ({ numberOfChildren, ...args }) => {
        return <Stack {...args}>{createChildren(numberOfChildren)}</Stack>;
    },
};

export const Vertical: Story = {
    args: {
        orientation: 'vertical',
    },
    render: ({ numberOfChildren, ...args }) => {
        return <Stack {...args}>{createChildren(numberOfChildren)}</Stack>;
    },
};

function createChildren(numberOfChildren: number) {
    return Array(numberOfChildren)
        .fill(null)
        .map((_, index) => {
            return (
                <div
                    key={index}
                    style={{
                        width: 120,
                        height: 120,
                        background: "linear-gradient(135deg, #ff9a8b, #ff6a88, #ff99ac)",
                        padding: "0",
                        borderRadius: "18px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.25)",
                        fontFamily: "sans-serif",
                        color: "#fff",
                        fontSize: "1rem",
                        fontWeight: "600",

                        /* Centralização total */
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",

                        /* Animação suave ao passar o mouse */
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                        e.currentTarget.style.boxShadow = "0 15px 30px rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.25)";
                    }}
                >
                    Quadrado Atraente
                </div>

            );
        });
}