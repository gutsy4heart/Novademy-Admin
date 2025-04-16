# Novademy Admin Panel

This is the admin panel for the Novademy platform. It allows administrators to manage courses, lessons, and user data.

## Technologies Used

- React
- TypeScript
- Axios for API requests
- CSS for styling

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- NPM or Yarn

### Installation

1. Clone the repository:
```
git clone <repository-url>
```

2. Navigate to the project directory:
```
cd novademy-admin
```

3. Install dependencies:
```
npm install
```

### Running the Application

Start the development server:
```
npm start
```

The application will run on [http://localhost:3000](http://localhost:3000).

### Building for Production

To build the application for production:
```
npm run build
```

## API Configuration

The application connects to the Novademy API running on `http://localhost:5258/api/v1`. If your API is running on a different URL, update the `baseURL` in `src/api/apiClient.ts`.

## Admin Panel Features

- Authentication with role-based access control
- Dashboard with statistics
- Course management (create, edit, delete)
- Lesson management (create, edit, delete)
- User role management

## Backend Integration

This admin panel is designed to work with the Novademy backend API, which should be running separately. Make sure the backend API is running before using this admin panel.

## License

This project is licensed under the MIT License.

## Структура проекта

```
novademy-admin/
├── public/                  # Статические файлы
├── src/                     # Исходный код
│   ├── api/                 # API клиенты и сервисы
│   │   ├── apiClient.ts     # Общий API клиент
│   │   ├── authService.ts   # Сервис аутентификации
│   │   ├── courseService.ts # Сервис управления курсами
│   │   └── lessonService.ts # Сервис управления уроками
│   ├── components/          # React компоненты
│   │   ├── auth/            # Компоненты аутентификации
│   │   ├── courses/         # Компоненты управления курсами
│   │   ├── dashboard/       # Компоненты дашборда
│   │   ├── layout/          # Компоненты макета
│   │   ├── lessons/         # Компоненты управления уроками
│   │   ├── packages/        # Компоненты управления пакетами
│   │   ├── subscriptions/   # Компоненты управления подписками
│   │   └── users/           # Компоненты управления пользователями
│   ├── contexts/            # React контексты
│   │   └── AuthContext.tsx  # Контекст авторизации
│   ├── styles/              # Стили
│   │   └── Admin.css        # Стили админ-панели
│   ├── types/               # TypeScript типы
│   │   └── enums.ts         # Перечисления
│   ├── utils/               # Утилиты и вспомогательные функции
│   ├── App.tsx              # Корневой компонент
│   └── index.tsx            # Точка входа
└── package.json             # Зависимости и скрипты
```

## Особенности проекта

### Аутентификация и авторизация

1. Клонируйте репозиторий
2. Установите зависимости:
```
npm install
```
3. Настройте переменные окружения в `.env`:
```
REACT_APP_API_URL=http://localhost:5258/api/v1
```
4. Запустите проект в режиме разработки:
```
npm start
```
5. Для сборки проекта:
```
npm run build
```

## Особенности проекта

### Аутентификация и авторизация

Для доступа к административной панели требуется аутентификация. Доступ имеют только пользователи с ролями "admin" и "teacher", при этом для учителей доступ к некоторым разделам (пакеты, подписки, управление пользователями) ограничен.

### Интеграция с API

Административная панель взаимодействует с тем же бэкендом, что и клиентское приложение, используя REST API. Для хранения токена авторизации используется localStorage, но с другими ключами, чтобы избежать конфликтов.

### Разделение с клиентским приложением

Панель администратора является полностью отдельным проектом, что обеспечивает:
- Улучшенную безопасность
- Разделение ответственности
- Оптимизированный код и бандл
- Возможность независимого развертывания и масштабирования

## Технологии

- React 19
- TypeScript
- React Router 7
- Axios для API запросов
- Context API для управления состоянием 