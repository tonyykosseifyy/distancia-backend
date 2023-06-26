import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            datasources: {
                db: {
                    url: "postgres://tonyykosseifyy:9HxBej8yAZYo@ep-autumn-scene-673868-pooler.ap-southeast-1.aws.neon.tech/neondb"
                }
            }
        });
    }

   async onModuleInit() {
        await this.$connect();    
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
