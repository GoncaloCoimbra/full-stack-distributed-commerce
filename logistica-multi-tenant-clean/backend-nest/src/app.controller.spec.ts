import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';

describe('AppController', () => {
  let appController: AppController;
  const mockPrismaService = {
    $queryRaw: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('health', () => {
    it('should return structured health metadata', async () => {
      const health = await appController.getHealth();

      expect(health).toHaveProperty('status', 'ok');
      expect(health).toHaveProperty('database');
      expect(health).toHaveProperty('redis');
      expect(health.database).toHaveProperty('configured');
      expect(health.database).toHaveProperty('connected');
      expect(health.redis).toHaveProperty('configured');
      expect(health.redis).toHaveProperty('connected');
    });
  });
});
