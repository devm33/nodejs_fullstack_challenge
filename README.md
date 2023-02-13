# Fullstack Example with Next.js and Prisma

Project scaffolded with `try-prisma`:

```
npx try-prisma --template typescript/rest-nextjs-api-routes
```

### 1. Set up

Install npm dependencies:

```
npm install
```

### 2. Create the database

Run the following command to create the SQLite database file

```
npx prisma migrate dev --name init
```

### 3. Start the app

```
npm run dev
```

The app is now running at [`http://localhost:3000/`](http://localhost:3000/).