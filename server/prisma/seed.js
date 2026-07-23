const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Demonstration images sourced from wger.de's open exercise database (CC-BY-SA / CC0).
const exercises = [
  {
    name: "Bench Press",
    muscleGroup: "CHEST",
    description: "Yatay bankta bar ile gogus itisi",
    imageUrl: "https://wger.de/media/exercise-images/192/Bench-press-1.png.400x400_q85.png",
  },
  {
    name: "Incline Dumbbell Press",
    muscleGroup: "CHEST",
    description: "Egimli bankta dambil ile gogus itisi",
    imageUrl: "https://wger.de/media/exercise-images/16/Incline-press-1.png.400x400_q85.png",
  },
  {
    name: "Cable Fly",
    muscleGroup: "CHEST",
    description: "Kablo ile gogus acma hareketi",
    imageUrl: "https://wger.de/media/exercise-images/122/Incline-cable-flyes-1.png.400x400_q85.jpg",
  },

  {
    name: "Lat Pulldown",
    muscleGroup: "BACK",
    description: "Kabloda gogus onune cekis",
    imageUrl: "https://wger.de/media/exercise-images/158/0d51a0f2-622f-434b-beb8-1a003c54712a.png.400x400_q85.jpg",
  },
  {
    name: "Barbell Row",
    muscleGroup: "BACK",
    description: "Bar ile egilerek kurek cekme",
    imageUrl: "https://wger.de/media/exercise-images/109/Barbell-rear-delt-row-1.png.400x400_q85.jpg",
  },
  {
    name: "Deadlift",
    muscleGroup: "BACK",
    description: "Yerden bar kaldirma hareketi",
    imageUrl: "https://wger.de/media/exercise-images/184/1709c405-620a-4d07-9658-fade2b66a2df.jpeg.400x400_q85.jpg",
  },

  {
    name: "Squat",
    muscleGroup: "LEGS",
    description: "Bar ile cift bacak comelme hareketi",
    imageUrl: "https://wger.de/media/exercise-images/1963/db285682-1ab3-4be0-ae00-5117ecce1ee6.png.400x400_q85.png",
  },
  {
    name: "Leg Press",
    muscleGroup: "LEGS",
    description: "Leg press makinesinde bacak itisi",
    imageUrl: "https://wger.de/media/exercise-images/371/d2136f96-3a43-4d4c-9944-1919c4ca1ce1.webp.400x400_q85.png",
  },
  {
    name: "Lunge",
    muscleGroup: "LEGS",
    description: "Adim alarak yapilan bacak hareketi",
    imageUrl: "https://wger.de/media/exercise-images/984/5c7ffe68-e7b2-47f3-a22a-f9cc28640432.png.400x400_q85.jpg",
  },

  {
    name: "Overhead Press",
    muscleGroup: "SHOULDERS",
    description: "Bar ile omuz uzerine itis",
    imageUrl: "https://wger.de/media/exercise-images/1893/7dbad19e-0616-41fd-9d7d-3e21649c0eea.png.400x400_q85.png",
  },
  {
    name: "Lateral Raise",
    muscleGroup: "SHOULDERS",
    description: "Dambil ile yana kaldirma",
    imageUrl: "https://wger.de/media/exercise-images/148/lateral-dumbbell-raises-large-2.png.400x400_q85.jpg",
  },
  {
    name: "Face Pull",
    muscleGroup: "SHOULDERS",
    description: "Kablo ile yuze cekis, arka omuz",
    imageUrl: "https://wger.de/media/exercise-images/1639/8927346e-f5ca-4795-bdf1-5ac9309401e7.webp.400x400_q85.jpg",
  },

  {
    name: "Barbell Curl",
    muscleGroup: "BICEPS",
    description: "Bar ile biceps curl",
    imageUrl: "https://wger.de/media/exercise-images/74/Bicep-curls-1.png.400x400_q85.png",
  },
  {
    name: "Dumbbell Curl",
    muscleGroup: "BICEPS",
    description: "Dambil ile biceps curl",
    imageUrl: "https://wger.de/media/exercise-images/81/Biceps-curl-1.png.400x400_q85.png",
  },
  {
    name: "Hammer Curl",
    muscleGroup: "BICEPS",
    description: "Notr tutuşla yapilan curl",
    imageUrl: "https://wger.de/media/exercise-images/86/Bicep-hammer-curl-1.png.400x400_q85.png",
  },

  {
    name: "Tricep Pushdown",
    muscleGroup: "TRICEPS",
    description: "Kabloda triceps itisi",
    imageUrl: "https://wger.de/media/exercise-images/1185/c5ca283d-8958-4fd8-9d59-a3f52a3ac66b.jpg.400x400_q85.jpg",
  },
  {
    name: "Skull Crusher",
    muscleGroup: "TRICEPS",
    description: "Bar ile triceps ekstansiyonu",
    imageUrl:
      "https://wger.de/media/exercise-images/84/Lying-close-grip-triceps-press-to-chin-1.png.400x400_q85.png",
  },
  {
    name: "Close-Grip Bench Press",
    muscleGroup: "TRICEPS",
    description: "Dar tutusla bench press",
    imageUrl: "https://wger.de/media/exercise-images/88/Narrow-grip-bench-press-1.png.400x400_q85.png",
  },

  {
    name: "Plank",
    muscleGroup: "CORE",
    description: "On kollarda vucudu duz tutma hareketi",
    imageUrl: "https://wger.de/media/exercise-images/458/b7bd9c28-9f1d-4647-bd17-ab6a3adf5770.png.400x400_q85.png",
  },
  {
    name: "Crunch",
    muscleGroup: "CORE",
    description: "Yerde karin kasma hareketi",
    imageUrl: "https://wger.de/media/exercise-images/91/Crunches-1.png.400x400_q85.png",
  },
  {
    name: "Russian Twist",
    muscleGroup: "CORE",
    description: "Oturarak govdeyi yanlara cevirme",
    imageUrl: "https://wger.de/media/exercise-images/1193/70ca5d80-3847-4a8c-8882-c6e9e485e29e.png.400x400_q85.png",
  },
  {
    name: "Hanging Leg Raise",
    muscleGroup: "CORE",
    description: "Barda asili halde bacak kaldirma",
    imageUrl: "https://wger.de/media/exercise-images/979/27097a3a-5749-428d-b94c-6082afe390f6.png.400x400_q85.png",
  },

  {
    name: "Kosu (Kosu Bandi)",
    muscleGroup: "CARDIO",
    description: "Sabit hizda kosu bandinda kosu",
    imageUrl: "https://wger.de/media/exercise-images/1615/7792295c-83b6-4ea8-9353-ce02f0ad2559.jpg.400x400_q85.jpg",
  },
  { name: "Ip Atlama", muscleGroup: "CARDIO", description: "Iple zip hareketi", imageUrl: null },
  {
    name: "Bisiklet",
    muscleGroup: "CARDIO",
    description: "Sabit bisiklette pedal cevirme",
    imageUrl: "https://wger.de/media/exercise-images/1618/c18baedc-ff98-4fb2-b4f5-38a05c12f637.png.400x400_q85.png",
  },
  {
    name: "Rower (Kurek Ergometre)",
    muscleGroup: "CARDIO",
    description: "Kurek makinesinde cekis hareketi",
    imageUrl: null,
  },

  {
    name: "Burpee",
    muscleGroup: "FULL_BODY",
    description: "Comelme, siçrama ve sinav pozisyonunu birlestiren hareket",
    imageUrl: null,
  },
  {
    name: "Kettlebell Swing",
    muscleGroup: "FULL_BODY",
    description: "Kalcadan itisle kettlebell sallama",
    imageUrl: "https://wger.de/media/exercise-images/960/da4d0560-da89-4bb5-b91f-746458fb04ad.png.400x400_q85.png",
  },
  {
    name: "Thruster",
    muscleGroup: "FULL_BODY",
    description: "On squat ile omuz itisini birlestiren hareket",
    imageUrl: null,
  },
  {
    name: "Clean and Press",
    muscleGroup: "FULL_BODY",
    description: "Bari yerden omuza cekip yukari itme",
    imageUrl: "https://wger.de/media/exercise-images/1901/046f0f42-0ed5-48c5-a9ee-41de25e3b6a0.png.400x400_q85.jpg",
  },
];

async function main() {
  for (const exercise of exercises) {
    await prisma.exercise.upsert({
      where: { name: exercise.name },
      update: { description: exercise.description, imageUrl: exercise.imageUrl },
      create: exercise,
    });
  }
  console.log(`Seed tamamlandi: ${exercises.length} egzersiz eklendi/guncellendi.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
