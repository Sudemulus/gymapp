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

  { name: "Plank", muscleGroup: "CORE", description: "On kollarda vucudu duz tutma hareketi" },
  { name: "Crunch", muscleGroup: "CORE", description: "Yerde karin kasma hareketi" },
  { name: "Russian Twist", muscleGroup: "CORE", description: "Oturarak govdeyi yanlara cevirme" },
  { name: "Hanging Leg Raise", muscleGroup: "CORE", description: "Barda asili halde bacak kaldirma" },

  { name: "Kosu (Kosu Bandi)", muscleGroup: "CARDIO", description: "Sabit hizda kosu bandinda kosu" },
  { name: "Ip Atlama", muscleGroup: "CARDIO", description: "Iple zip hareketi" },
  { name: "Bisiklet", muscleGroup: "CARDIO", description: "Sabit bisiklette pedal cevirme" },
  { name: "Rower (Kurek Ergometre)", muscleGroup: "CARDIO", description: "Kurek makinesinde cekis hareketi" },

  { name: "Burpee", muscleGroup: "FULL_BODY", description: "Comelme, siçrama ve sinav pozisyonunu birlestiren hareket" },
  { name: "Kettlebell Swing", muscleGroup: "FULL_BODY", description: "Kalcadan itisle kettlebell sallama" },
  { name: "Thruster", muscleGroup: "FULL_BODY", description: "On squat ile omuz itisini birlestiren hareket" },
  { name: "Clean and Press", muscleGroup: "FULL_BODY", description: "Bari yerden omuza cekip yukari itme" },
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
