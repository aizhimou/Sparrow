import { MantineThemeOverride } from '@mantine/core';

export const sparrowTheme: MantineThemeOverride = {
  primaryColor: 'rust',
  colors: {
    // 主色：棕红色（logo 羽毛主色）
    rust: [
      '#fcecea', // 0
      '#f8d4ce', // 1
      '#f2b1a7', // 2
      '#ec8d80', // 3
      '#e6695a', // 4
      '#e04c3e', // 5
      '#b63d32', // 6
      '#8c2e27', // 7
      '#62201b', // 8
      '#39110f', // 9
    ],

    // 中性色：米白色（logo 胸部/腹部主色）
    cream: [
      '#fffdf9',
      '#fff9ed',
      '#fff3da',
      '#ffecc7',
      '#ffe5b4',
      '#ffde9f',
      '#e6c88c',
      '#c1a871',
      '#9c8958',
      '#776b40',
    ],

    // 深色：用于文字、描边等（logo 轮廓/喙部颜色）
    cocoa: [
      '#f3eeec',
      '#dcd0cb',
      '#c5b2a9',
      '#ae9487',
      '#977765',
      '#805a44',
      '#664534',
      '#4c3327',
      '#32211a',
      '#1a110d',
    ],
  },

  primaryShade: 4, // 使用 rust[3] 作为默认主色调

  defaultRadius: 'sm',

  fontFamily: 'Inter, sans-serif',

  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
  },
};
