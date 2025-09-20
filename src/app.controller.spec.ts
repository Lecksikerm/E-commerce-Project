import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let mockAppService: Partial<AppService>;

  beforeEach(async () => {
    // ✅ Create a mock for AppService
    mockAppService = {
      getHello: jest.fn().mockReturnValue('Welcome to my API'), // You can change this anytime
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService, // ✅ Use the mock instead of real service
        },
      ],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should return value from AppService', () => {
    expect(appController.getHello()).toBe('Welcome to my API');
    expect(mockAppService.getHello).toHaveBeenCalled(); // ✅ also checks the service was called
  });
});


