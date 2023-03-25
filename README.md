## Introduction

SNHS Legacy is a smart, modern, and lightweight student participation tracking software designed with the intent to empower *all* educators.

SNHS Legacy was born from the desire to alleviate the burden on educators by lowering the barrier of technological literacy through the creation of an intuitive, yet powerful interface.

SNHS Legacy emplores the following technologies:

### Frontend
* TailwindCSS
* TypeScript
* React
* Tauri
* IBM Carbon Design System

### Backend
* Rust
* SQLite
* Tauri

## Instructions

1 - Install dependencies

Run:

```sh
npm install
```

2 - Run the App in development mode:

Run:

```sh
npm run tauri:dev
```

`NOTE:` Installing dependencies (Step 1) or running the app in development mode (Step 2) for the first time will *likely* take a longer time than usual.

## Production

When ready to create a build on any supported platform:

Run:

```sh
npm run tauri:build
```
