# Todo Mobile

Aplicación móvil de lista de tareas desarrollada con React Native y Expo. Permite a los usuarios autenticarse con Firebase, gestionar listas de tareas y crear/consultar tareas con prioridades, fechas de vencimiento y colores personalizados.

## Tecnologías utilizadas

- **React Native** con **Expo** (~54)
- **Expo Router** — navegación basada en sistema de archivos
- **TypeScript**
- **NativeWind** (Tailwind CSS para React Native)
- **Firebase** — autenticación de usuarios
- **Axios** — consumo de la API REST (backend en Java Quarkus)
- **AsyncStorage / SecureStore** — persistencia local del token
- **Yarn** — gestor de paquetes

## Requisitos previos

- Node.js >= 18
- Yarn (`npm install -g yarn`)
- Expo Go instalado en el dispositivo o un emulador configurado

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd todo-mobile
```

### 2. Instalar dependencias

```bash
yarn install
```

### 3. Configurar variables de entorno

Coloca el archivo `.env` (proporcionado por separado) en la raíz del proyecto. El archivo debe quedar así:

```
todo-mobile/
├── .env          ← aquí
├── app/
├── package.json
└── ...
```

### 4. Iniciar la aplicación

```bash
yarn start
```

Escanea el QR con la app **Expo Go** en tu dispositivo (iOS o Android), o presiona en la terminal:

- `a` → emulador Android
- `i` → simulador iOS

## Variables de entorno necesarias

El archivo `.env` debe contener las siguientes claves:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_API_URL=
```

> El archivo `.env` está excluido del repositorio por seguridad. Solicitarlo al equipo de desarrollo.

## Links deployados

> Link de deploy de backend en google cloud: https://todo-backend-763487457914.us-central1.run.app

## Usuario de prueba

| Campo      | Valor              |
|------------|--------------------|
| Correo     | emmanuel@gmail.com |
| Contraseña | 1234e5678          |

## Endpoints del backend consumidos

| Método | Ruta        | Descripción                           |
|--------|-------------|---------------------------------------|
| POST   | /auth/login | Autenticación con token de Firebase   |
| GET    | /lists      | Obtener todas las listas del usuario  |
| POST   | /lists      | Crear una nueva lista                 |
| GET    | /tasks      | Obtener tareas por `listId`           |
| GET    | /tasks/{id} | Obtener una tarea específica por ID   |
| POST   | /tasks      | Crear una nueva tarea                 |
