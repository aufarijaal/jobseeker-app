-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('SD', 'SMP', 'SMA', 'DIPLOMA_1', 'DIPLOMA_2', 'DIPLOMA_3', 'DIPLOMA_4', 'SARJANA', 'MAGISTER', 'DOKTOR');

-- CreateTable
CREATE TABLE "JobExperiences" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "JobExperiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Educations" (
    "id" SERIAL NOT NULL,
    "level" "EducationLevel" NOT NULL,
    "institution" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Educations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JobExperiences" ADD CONSTRAINT "JobExperiences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Educations" ADD CONSTRAINT "Educations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
