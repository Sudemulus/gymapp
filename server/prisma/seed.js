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
    imageUrl: null,
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
    imageUrl: "https://wger.de/media/exercise-images/161/Dead-lifts-1.png.400x400_q85.jpg",
  },

  {
    name: "Squat",
    muscleGroup: "LEGS",
    description: "Bar ile cift bacak comelme hareketi",
    imageUrl: null,
  },
  {
    name: "Leg Press",
    muscleGroup: "LEGS",
    description: "Leg press makinesinde bacak itisi",
    imageUrl: null,
  },
  {
    name: "Lunge",
    muscleGroup: "LEGS",
    description: "Adim alarak yapilan bacak hareketi",
    imageUrl: null,
  },

  {
    name: "Overhead Press",
    muscleGroup: "SHOULDERS",
    description: "Bar ile omuz uzerine itis",
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
  },
  {
    name: "Hanging Leg Raise",
    muscleGroup: "CORE",
    description: "Barda asili halde bacak kaldirma",
    imageUrl: "https://wger.de/media/exercise-images/125/Leg-raises-1.png.400x400_q85.png",
  },

  {
    name: "Kosu (Kosu Bandi)",
    muscleGroup: "CARDIO",
    description: "Sabit hizda kosu bandinda kosu",
    imageUrl: null,
  },
  { name: "Ip Atlama", muscleGroup: "CARDIO", description: "Iple zip hareketi", imageUrl: null },
  {
    name: "Bisiklet",
    muscleGroup: "CARDIO",
    description: "Sabit bisiklette pedal cevirme",
    imageUrl: null,
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
    imageUrl: null,
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
    imageUrl: null,
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
