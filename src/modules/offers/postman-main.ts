import "dotenv/config";
import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "@/src/app.module";
import { TransactionsModule } from "@/modules/transactions/transactions.module";
import { OffersModule } from "./offers.module";

@Module({ imports: [AppModule, OffersModule, TransactionsModule] })
export class PostmanModule {}

async function startPostmanServer() {
  const port = Number(process.env.PORT ?? "5001");
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  const app = await NestFactory.create(PostmanModule);
  const config = new DocumentBuilder()
    .setTitle("UniSwap Local API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  SwaggerModule.setup("api", app, SwaggerModule.createDocument(app, config));
  await app.listen(port, "127.0.0.1");
}

if (require.main === module) {
  startPostmanServer().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
