-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('PHD', 'THESIS', 'OTHER');

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "type" "EventType" NOT NULL DEFAULT 'PHD',
ADD COLUMN     "typeOtherName" TEXT;
