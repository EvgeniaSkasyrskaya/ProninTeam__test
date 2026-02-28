import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  // Указываем среду браузера (нужно установить npm install jest-environment-jsdom)
  testEnvironment: 'jsdom',
  // Подключаем файл с настройками (создадим его ниже)
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  // Маппинг для стилей и картинок
  moduleNameMapper: {
    // Если используете CSS-модули
    '\\.module\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Если используете обычные CSS
    // '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.css$': 'identity-obj-proxy',
    // '^feather-icons-react$': '<rootDir>/node_modules/feather-icons-react/build/index.js',
  },
  transformIgnorePatterns: ['node_modules/(?!(feather-icons-react)/)'],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        isolatedModules: true,
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowJs: true,
          skipLibCheck: true,
        },
      },
    ],
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
};

export default config;
