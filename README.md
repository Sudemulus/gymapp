# TrackGym

Spor takip uygulamasi. `client` (Next.js) ve `server` (Express + Prisma) olarak iki ayri projeden olusur.

## Klasor yapisi

```
gymapp/
  client/   -> Next.js (TypeScript, Tailwind, App Router)
  server/   -> Express + TypeScript + Prisma (MySQL)
```

## Veritabani semasi (Faz 1)

`server/prisma/schema.prisma` icinde 4 tablo tanimli:

- **users**: kullanici bilgileri (ad, email, sifre hash)
- **exercises**: egzersiz kutuphanesi (ad, hedef kas grubu, aciklama)
- **workouts**: kullanicinin antrenman oturumlari (tarih, ad, not)
- **workout_sets**: bir antrenmandaki her set icin agirlik (kg) ve tekrar sayisi, ilgili egzersize ve antrenmana bagli

Iliskiler: `User 1-N Workout`, `Workout 1-N WorkoutSet`, `Exercise 1-N WorkoutSet`.

## Kurulum

### Server

```bash
cd server
npm install
```

`server/.env` icinde `DATABASE_URL` degerini kendi MySQL baglantinla guncelle:

```
DATABASE_URL="mysql://KULLANICI:SIFRE@localhost:3306/gymapp"
```

Veritabanini olustur ve semayi uygula:

```bash
npm run prisma:migrate -- --name init
```

Sunucuyu baslat:

```bash
npm run dev
```

Sunucu varsayilan olarak `http://localhost:4000` uzerinde calisir. `GET /health` ile ayakta oldugunu dogrulayabilirsin.

### Client

```bash
cd client
npm run dev
```

Client `http://localhost:3000` uzerinde calisir.

## API uc noktalari (Faz 1)

- `POST /api/users/register`, `POST /api/users/login`
- `GET /api/exercises`, `GET /api/exercises/:id`, `POST /api/exercises`
- `GET /api/workouts`, `GET /api/workouts/:id`, `POST /api/workouts`
- `POST /api/workout-sets`, `DELETE /api/workout-sets/:id`
