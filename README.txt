Inicializar proyecto
npm init -y

Iniciar typescript
npm i typescript -D
npm run tsc -- --init

Instalar dependencias
npm i ts-node-dev -D
npm i express
npm i @types/express -D
npm i dotenv
npm i cookie-parser
npm i @types/cookie-parser -D
npm i jsonwebtoken
npm i @types/jsonwebtoken -D
npm i cors
npm i @types/cors -D
npm i prisma @prisma/client
npm i bcrypt
npm i @types/bcrypt -D

Ejecutar proyecto
npm run dev -> ejecutar ts
npm run tsc -> generar js
npm run start -> ejecutar js

PRISMA

Generar cliente
npx prisma generate

Migraciones
npx prisma migrate dev --name init --create-only

Desplegar
npx prisma migrate deploy
