import { NestFactory } from '@nestjs/core';
import {SeedModule} from "../seed.module";
import {SeedCommand} from "../seed.command";

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(SeedModule);
    const seed = app.get(SeedCommand);
    await seed.run()

    await app.close();
}
bootstrap();