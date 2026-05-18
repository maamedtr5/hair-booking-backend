-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "googleEventId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleAccessToken" TEXT,
ADD COLUMN     "googleRefreshToken" TEXT,
ADD COLUMN     "googleTokenExpiry" TIMESTAMP(3);
