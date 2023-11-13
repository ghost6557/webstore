-- CreateTable
CREATE TABLE "model_storage_price" (
    "msp_id" BIGSERIAL NOT NULL,
    "storage" VARCHAR,
    "price" BIGINT,
    "m_id" BIGINT,

    CONSTRAINT "model_storage_price_pkey" PRIMARY KEY ("msp_id")
);

-- CreateTable
CREATE TABLE "phone_desc" (
    "pd_id" BIGSERIAL NOT NULL,
    "m_id" BIGINT,
    "desc" VARCHAR,
    "year" BIGINT,
    "display" VARCHAR,
    "resolution" VARCHAR,
    "processor" VARCHAR,
    "main_camera" VARCHAR,
    "front_camera" VARCHAR,
    "battery" DECIMAL,
    "face_id" BOOLEAN,
    "os" VARCHAR,
    "img_url" VARCHAR,

    CONSTRAINT "phone_desc_pkey" PRIMARY KEY ("pd_id")
);

-- CreateTable
CREATE TABLE "phone_models" (
    "m_id" BIGSERIAL NOT NULL,
    "model_name" VARCHAR,
    "brand" VARCHAR,

    CONSTRAINT "smartphone_models_pkey" PRIMARY KEY ("m_id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
