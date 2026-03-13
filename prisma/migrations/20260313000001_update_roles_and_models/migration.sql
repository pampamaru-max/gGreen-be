-- Update Role enum: replace USER with SUPERADMIN, EVALUATOR, EVALUATEE
ALTER TYPE "Role" RENAME TO "Role_old";
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'ADMIN', 'EVALUATOR', 'EVALUATEE');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "Role" USING 'EVALUATEE'::"Role";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'EVALUATEE'::"Role";
DROP TYPE "Role_old";

-- CreateTable: categories
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "maxScore" INTEGER NOT NULL DEFAULT 15,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable: topics
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable: indicators
CREATE TABLE "indicators" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "maxScore" INTEGER NOT NULL DEFAULT 4,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL DEFAULT '',
    "detail" TEXT NOT NULL DEFAULT '',
    "scoringCriteria" JSONB NOT NULL DEFAULT '[]',
    "notes" TEXT NOT NULL DEFAULT '',
    "evidenceDescription" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable: scoring_levels
CREATE TABLE "scoring_levels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "minScore" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "maxScore" DECIMAL(5,2) NOT NULL DEFAULT 100,
    "color" TEXT NOT NULL DEFAULT '#22c55e',
    "icon" TEXT NOT NULL DEFAULT 'trophy',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scoring_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable: certificate_templates
CREATE TABLE "certificate_templates" (
    "id" SERIAL NOT NULL,
    "scoringLevelId" INTEGER,
    "title" TEXT NOT NULL DEFAULT 'ใบประกาศนียบัตร',
    "subtitle" TEXT NOT NULL DEFAULT '',
    "bodyText" TEXT NOT NULL DEFAULT 'ขอมอบใบประกาศนียบัตรฉบับนี้ให้แก่',
    "footerText" TEXT NOT NULL DEFAULT '',
    "signerName" TEXT NOT NULL DEFAULT '',
    "signerTitle" TEXT NOT NULL DEFAULT '',
    "bgImageUrl" TEXT,
    "logoUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#1a5632',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificate_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable: programs
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "icon" TEXT NOT NULL DEFAULT 'Building2',
    "about" JSONB NOT NULL DEFAULT '[]',
    "guidelines" JSONB NOT NULL DEFAULT '[]',
    "reports" JSONB NOT NULL DEFAULT '[]',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey: topics -> categories
ALTER TABLE "topics" ADD CONSTRAINT "topics_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: indicators -> topics
ALTER TABLE "indicators" ADD CONSTRAINT "indicators_topicId_fkey"
    FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: certificate_templates -> scoring_levels
ALTER TABLE "certificate_templates" ADD CONSTRAINT "certificate_templates_scoringLevelId_fkey"
    FOREIGN KEY ("scoringLevelId") REFERENCES "scoring_levels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex: certificate_templates unique scoringLevelId
CREATE UNIQUE INDEX "certificate_templates_scoringLevelId_key" ON "certificate_templates"("scoringLevelId");
