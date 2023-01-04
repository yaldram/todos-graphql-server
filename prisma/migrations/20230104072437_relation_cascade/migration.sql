-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_todoId_fkey";

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_todoId_fkey" FOREIGN KEY ("todoId") REFERENCES "Todos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
