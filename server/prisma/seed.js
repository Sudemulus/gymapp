const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const exercises = [
  { name: "Bench Press", muscleGroup: "CHEST", description: "Yatay bankta bar ile gogus itisi" },
  { name: "Incline Dumbbell Press", muscleGroup: "CHEST", description: "Egimli bankta dambil ile gogus itisi" },
  { name: "Cable Fly", muscleGroup: "CHEST", description: "Kablo ile gogus acma hareketi" },

  { name: "Lat Pulldown", muscleGroup: "BACK", description: "Kabloda gogus onune cekis" },
  { name: "Barbell Row", muscleGroup: "BACK", description: "Bar ile egilerek kurek cekme" },
  { name: "Deadlift", muscleGroup: "BACK", description: "Yerden bar kaldirma hareketi" },

  { name: "Squat", muscleGroup: "LEGS", description: "Bar ile cift bacak comelme hareketi" },
  { name: "Leg Press", muscleGroup: "LEGS", description: "Leg press makinesinde bacak itisi" },
  { name: "Lunge", muscleGroup: "LEGS", description: "Adim alarak yapilan bacak hareketi" },

  { name: "Overhead Press", muscleGroup: "SHOULDERS", description: "Bar ile omuz uzerine itis" },
  { name: "Lateral Raise", muscleGroup: "SHOULDERS", description: "Dambil ile yana kaldirma" },
  { name: "Face Pull", muscleGroup: "SHOULDERS", description: "Kablo ile yuze cekis, arka omuz" },

  { name: "Barbell Curl", muscleGroup: "BICEPS", description: "Bar ile biceps curl" },
  { name: "Dumbbell Curl", muscleGroup: "BICEPS", description: "Dambil ile biceps curl" },
  { name: "Hammer Curl", muscleGroup: "BICEPS", description: "Notr tutuşla yapilan curl" },

  { name: "Tricep Pushdown", muscleGroup: "TRICEPS", description: "Kabloda triceps itisi" },
  { name: "Skull Crusher", muscleGroup: "TRICEPS", description: "Bar ile triceps ekstansiyonu" },
  { name: "Close-Grip Bench Press", muscleGroup: "TRICEPS", description: "Dar tutusla bench press" },
];

async function main() {
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: {},
      create: exercise,
    });
  }
  console.log(`Seed tamamlandi: ${exercises.length} egzersiz eklendi/kontrol edildi.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
