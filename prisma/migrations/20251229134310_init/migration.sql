/*
  Warnings:

  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MimeType" AS ENUM ('IMAGE_PNG', 'IMAGE_JPEG', 'IMAGE_JPG');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropTable
DROP TABLE "Token";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "specialist_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL,
    "mime_type" "MimeType" NOT NULL,
    "media_type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_fees" (
    "id" TEXT NOT NULL,
    "tier_name" TEXT NOT NULL,
    "min_value" INTEGER NOT NULL DEFAULT 0,
    "max_value" INTEGER NOT NULL DEFAULT 0,
    "platform_fee_percentage" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_fees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_offerings" (
    "id" TEXT NOT NULL,
    "specialistId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_offerings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specialists" (
    "id" TEXT NOT NULL,
    "average_rating" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "is_draft" BOOLEAN NOT NULL DEFAULT true,
    "total_number_of_ratings" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "base_price" DECIMAL(10,2) NOT NULL,
    "platform_fee" DECIMAL(10,2) NOT NULL,
    "final_price" DECIMAL(10,2) NOT NULL,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "duration_days" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "specialists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT DEFAULT '',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "address" TEXT DEFAULT '',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "specialists_slug_key" ON "specialists"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_email_key" ON "tokens"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_specialist_id_fkey" FOREIGN KEY ("specialist_id") REFERENCES "specialists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_offerings" ADD CONSTRAINT "service_offerings_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "specialists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
