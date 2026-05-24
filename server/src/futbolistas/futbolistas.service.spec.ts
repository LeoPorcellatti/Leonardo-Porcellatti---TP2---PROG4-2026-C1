import { Test, TestingModule } from '@nestjs/testing';
import { FutbolistasService } from './futbolistas.service';

describe('FutbolistasService', () => {
  let service: FutbolistasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FutbolistasService],
    }).compile();

    service = module.get<FutbolistasService>(FutbolistasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
