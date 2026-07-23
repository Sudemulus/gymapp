const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Demonstration GIFs sourced from exercisedb.dev's open exercise database
// (consistent 3D muscle-highlight animation style across the whole set).
const exercises = [
  {
    name: "Bench Press",
    muscleGroup: "CHEST",
    description: "Yatay bankta bar ile gogus itisi",
    imageUrl: "https://static.exercisedb.dev/media/EIeI8Vf.gif",
  },
  {
    name: "Incline Dumbbell Press",
    muscleGroup: "CHEST",
    description: "Egimli bankta dambil ile gogus itisi",
    imageUrl: "https://static.exercisedb.dev/media/SpYC0Kp.gif",
  },
  {
    name: "Cable Fly",
    muscleGroup: "CHEST",
    description: "Kablo ile gogus acma hareketi",
    imageUrl: "https://static.exercisedb.dev/media/w4dLzSx.gif",
  },

  {
    name: "Lat Pulldown",
    muscleGroup: "BACK",
    description: "Kabloda gogus onune cekis",
    imageUrl: "https://static.exercisedb.dev/media/rkg41Fb.gif",
  },
  {
    name: "Barbell Row",
    muscleGroup: "BACK",
    description: "Bar ile egilerek kurek cekme",
    imageUrl: "https://static.exercisedb.dev/media/eZyBC3j.gif",
  },
  {
    name: "Deadlift",
    muscleGroup: "BACK",
    description: "Yerden bar kaldirma hareketi",
    imageUrl: "https://static.exercisedb.dev/media/ila4NZS.gif",
  },

  {
    name: "Squat",
    muscleGroup: "LEGS",
    description: "Bar ile cift bacak comelme hareketi",
    imageUrl: "https://static.exercisedb.dev/media/qXTaZnJ.gif",
  },
  {
    name: "Leg Press",
    muscleGroup: "LEGS",
    description: "Leg press makinesinde bacak itisi",
    imageUrl: "https://static.exercisedb.dev/media/10Z2DXU.gif",
  },
  {
    name: "Lunge",
    muscleGroup: "LEGS",
    description: "Adim alarak yapilan bacak hareketi",
    imageUrl: "https://static.exercisedb.dev/media/IZVHb27.gif",
  },

  {
    name: "Overhead Press",
    muscleGroup: "SHOULDERS",
    description: "Bar ile omuz uzerine itis",
    imageUrl: "https://static.exercisedb.dev/media/dCPESfR.gif",
  },
  {
    name: "Lateral Raise",
    muscleGroup: "SHOULDERS",
    description: "Dambil ile yana kaldirma",
    imageUrl: "https://static.exercisedb.dev/media/DsgkuIt.gif",
  },
  {
    name: "Face Pull",
    muscleGroup: "SHOULDERS",
    description: "Kablo ile yuze cekis, arka omuz",
    imageUrl: "https://static.exercisedb.dev/media/wqNPGCg.gif",
  },

  {
    name: "Barbell Curl",
    muscleGroup: "BICEPS",
    description: "Bar ile biceps curl",
    imageUrl: "https://static.exercisedb.dev/media/25GPyDY.gif",
  },
  {
    name: "Dumbbell Curl",
    muscleGroup: "BICEPS",
    description: "Dambil ile biceps curl",
    imageUrl: "https://static.exercisedb.dev/media/ae9UoXQ.gif",
  },
  {
    name: "Hammer Curl",
    muscleGroup: "BICEPS",
    description: "Notr tutuşla yapilan curl",
    imageUrl: "https://static.exercisedb.dev/media/2NpxjC1.gif",
  },

  {
    name: "Tricep Pushdown",
    muscleGroup: "TRICEPS",
    description: "Kabloda triceps itisi",
    imageUrl: "https://static.exercisedb.dev/media/3ZflifB.gif",
  },
  {
    name: "Skull Crusher",
    muscleGroup: "TRICEPS",
    description: "Bar ile triceps ekstansiyonu",
    imageUrl: "https://static.exercisedb.dev/media/h8LFzo9.gif",
  },
  {
    name: "Close-Grip Bench Press",
    muscleGroup: "TRICEPS",
    description: "Dar tutusla bench press",
    imageUrl: "https://static.exercisedb.dev/media/J6Dx1Mu.gif",
  },

  {
    name: "Plank",
    muscleGroup: "CORE",
    description: "On kollarda vucudu duz tutma hareketi",
    imageUrl: "https://static.exercisedb.dev/media/5VXmnV5.gif",
  },
  {
    name: "Crunch",
    muscleGroup: "CORE",
    description: "Yerde karin kasma hareketi",
    imageUrl: "https://static.exercisedb.dev/media/kjJ3VoQ.gif",
  },
  {
    name: "Russian Twist",
    muscleGroup: "CORE",
    description: "Oturarak govdeyi yanlara cevirme",
    imageUrl: "https://static.exercisedb.dev/media/XVDdcoj.gif",
  },
  {
    name: "Hanging Leg Raise",
    muscleGroup: "CORE",
    description: "Barda asili halde bacak kaldirma",
    imageUrl: "https://static.exercisedb.dev/media/I3tsCnC.gif",
  },

  {
    name: "Kosu (Kosu Bandi)",
    muscleGroup: "CARDIO",
    description: "Sabit hizda kosu bandinda kosu",
    imageUrl: "https://static.exercisedb.dev/media/rjiM4L3.gif",
  },
  {
    name: "Ip Atlama",
    muscleGroup: "CARDIO",
    description: "Iple zip hareketi",
    imageUrl: "https://static.exercisedb.dev/media/e1e76I2.gif",
  },
  {
    name: "Bisiklet",
    muscleGroup: "CARDIO",
    description: "Sabit bisiklette pedal cevirme",
    imageUrl: "https://static.exercisedb.dev/media/H1PESYI.gif",
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
    imageUrl: "https://static.exercisedb.dev/media/dK9394r.gif",
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
    imageUrl: "https://static.exercisedb.dev/media/f7Y9eDZ.gif",
  },
  {
    name: "Clean and Press",
    muscleGroup: "FULL_BODY",
    description: "Bari yerden omuza cekip yukari itme",
    imageUrl: "https://static.exercisedb.dev/media/SGY8Zui.gif",
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
