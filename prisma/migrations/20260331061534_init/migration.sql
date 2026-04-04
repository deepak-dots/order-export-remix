CREATE TABLE "Session" (
    "id" VARCHAR(191) PRIMARY KEY,
    "shop" VARCHAR(191) NOT NULL,
    "state" VARCHAR(191) NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" VARCHAR(191),
    "expires" TIMESTAMP(3),
    "accessToken" VARCHAR(191) NOT NULL,
    "userId" BIGINT,
    "firstName" VARCHAR(191),
    "lastName" VARCHAR(191),
    "email" VARCHAR(191),
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" VARCHAR(191),
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" VARCHAR(191),
    "refreshTokenExpires" TIMESTAMP(3)
);