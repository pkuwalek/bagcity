-- CreateTable
CREATE TABLE "bags" (
    "bag_id" SERIAL NOT NULL,
    "bag_name" VARCHAR(256) NOT NULL,
    "price" MONEY,
    "brand_id" INTEGER NOT NULL,
    "type_id" INTEGER,
    "color_id" INTEGER,

    CONSTRAINT "bags_pkey" PRIMARY KEY ("bag_id")
);

-- CreateTable
CREATE TABLE "brands" (
    "brand_id" SERIAL NOT NULL,
    "brand_name" VARCHAR(128),

    CONSTRAINT "brands_pkey" PRIMARY KEY ("brand_id")
);

-- CreateTable
CREATE TABLE "colors" (
    "color_id" SERIAL NOT NULL,
    "color_name" VARCHAR(128),

    CONSTRAINT "colors_pkey" PRIMARY KEY ("color_id")
);

-- CreateTable
CREATE TABLE "types" (
    "type_id" SERIAL NOT NULL,
    "type_name" VARCHAR(128),

    CONSTRAINT "types_pkey" PRIMARY KEY ("type_id")
);

-- CreateTable
CREATE TABLE "user_bag_relations" (
    "user_id" INTEGER NOT NULL,
    "bag_id" INTEGER NOT NULL,

    CONSTRAINT "user_bag_relations_pkey" PRIMARY KEY ("user_id","bag_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "user_name" VARCHAR(128) NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "password_hash" CHAR(128) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "bags" ADD CONSTRAINT "bags_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("brand_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bags" ADD CONSTRAINT "bags_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "colors"("color_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bags" ADD CONSTRAINT "bags_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "types"("type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_bag_relations" ADD CONSTRAINT "user_bag_relations_bag_id_fkey" FOREIGN KEY ("bag_id") REFERENCES "bags"("bag_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_bag_relations" ADD CONSTRAINT "user_bag_relations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
