import { Test, TestingModule } from '@nestjs/testing';
import { TransportsService } from '../transports.service';
import { PrismaService } from '../../../database/prisma.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { AuditLogService } from '../../audit-log/audit-log.service';

describe('TransportsService', () => {
  let service: TransportsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransportsService,
        {
          provide: PrismaService,
          useValue: {
            transport: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            company: {
              findUnique: jest.fn(),
            },
            vehicle: {
              findFirst: jest.fn(),
              update: jest.fn(),
            },
            product: {
              findFirst: jest.fn(),
              update: jest.fn(),
            },
            transportProduct: {
              create: jest.fn(),
              deleteMany: jest.fn(),
            },
            productMovement: {
              create: jest.fn(),
            },
            $transaction: jest.fn((callback) => callback({})),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            notifyTransportDelivered: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: AuditLogService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransportsService>(TransportsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getTrackingRoutes', () => {
    it('should return tracking routes with valid coordinates', async () => {
      // Arrange
      const mockTransport = {
        id: '1',
        internalCode: 'TRP-000001',
        origin: 'Lisboa',
        destination: 'Porto',
        status: 'IN_TRANSIT',
        departureDate: new Date(),
        estimatedArrival: new Date(Date.now() + 86400000),
        actualArrival: null,
        vehicle: { licensePlate: 'AA-00-AA' },
        company: { id: 'comp-1' },
      };

      (prismaService.transport.findMany as jest.Mock).mockResolvedValue([
        mockTransport,
      ]);

      // Act
      const result = await service.getTrackingRoutes();

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      // Verify coordinates are numbers
      const route = result[0];
      expect(route.locations).toBeDefined();
      expect(Array.isArray(route.locations)).toBe(true);
      expect(route.locations.length).toBe(3);

      if (route.locations.length > 0) {
        const location = route.locations[0];
        expect(typeof location.lat).toBe('number');
        expect(typeof location.lng).toBe('number');
      }
    });

    it('should handle transports with missing coordinates', async () => {
      // Arrange
      const mockTransport = {
        id: '1',
        transportId: 'TRN-001',
        name: 'Transport with Unknown City',
        origin: 'UnknownCity123',
        destination: 'AnotherUnknownCity456',
        departureDate: new Date(),
        estimatedArrival: new Date(Date.now() + 3600000), // 1 hour later
        status: 'pending',
      };

      (prismaService.transport.findMany as jest.Mock).mockResolvedValue([
        mockTransport,
      ]);

      // Act
      const result = await service.getTrackingRoutes();

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      // Should still provide fallback coordinates
      if (result.length > 0) {
        expect(result[0].locations).toBeDefined();
      }
    });

    it('should return valid route objects with required fields', async () => {
      // Arrange
      const mockTransport = {
        id: '1',
        transportId: 'TRN-001',
        name: 'Transport 1',
        origin: 'Lisboa',
        destination: 'Porto',
        departureDate: new Date(),
        estimatedArrival: new Date(Date.now() + 3600000),
        status: 'completed',
        company: {
          id: 'comp-1',
          name: 'Transport Company',
        },
      };

      (prismaService.transport.findMany as jest.Mock).mockResolvedValue([
        mockTransport,
      ]);

      // Act
      const result = await service.getTrackingRoutes();

      // Assert
      expect(result).toBeDefined();
      if (result.length > 0) {
        const route = result[0];
        expect(route.id).toBeDefined();
        expect(route.status).toBeDefined();
        expect(route.locations).toBeDefined();
        expect(route.origin_lat).toBeDefined();
        expect(route.origin_lng).toBeDefined();
        expect(route.destination_lat).toBeDefined();
        expect(route.destination_lng).toBeDefined();
      }
    });
  });

  describe('getCityCoordinates', () => {
    it('should return correct coordinates for known Portuguese cities', () => {
      // Test Lisboa
      const lisbonCoords = service['getCityCoordinates']('Lisboa');
      expect(lisbonCoords).toBeDefined();
      expect(lisbonCoords.lat).toBeDefined();
      expect(lisbonCoords.lng).toBeDefined();
      expect(typeof lisbonCoords.lat).toBe('number');
      expect(typeof lisbonCoords.lng).toBe('number');

      // Should be near actual Lisboa coordinates
      expect(lisbonCoords.lat).toBeGreaterThan(38);
      expect(lisbonCoords.lat).toBeLessThan(39);
    });

    it('should handle case-insensitive city names', () => {
      // Arrange
      const cityVariations = ['lisboa', 'LISBOA', 'Lisboa', 'LiSbOa'];

      // Act & Assert
      cityVariations.forEach((city) => {
        const coords = service['getCityCoordinates'](city);
        expect(coords).toBeDefined();
        expect(typeof coords.lat).toBe('number');
        expect(typeof coords.lng).toBe('number');
      });
    });

    it('should return fallback coordinates for unknown cities', () => {
      // Arrange
      const unknownCity = 'NonExistentCity123';

      // Act
      const coords = service['getCityCoordinates'](unknownCity);

      // Assert
      expect(coords).toBeDefined();
      expect(typeof coords.lat).toBe('number');
      expect(typeof coords.lng).toBe('number');
      // Should return Lisboa or Portugal center as fallback
      expect(coords.lat).toBeGreaterThan(38);
    });
  });

  describe('findOne', () => {
    it('should find transport by id', async () => {
      // Arrange
      const mockTransport = {
        id: '1',
        internalCode: 'TRP-000001',
        origin: 'Lisboa',
        destination: 'Porto',
      };

      (prismaService.transport.findFirst as jest.Mock).mockResolvedValue(
        mockTransport,
      );

      // Act
      const result = await service.findOne('1');

      // Assert
      expect(result).toEqual(mockTransport);
      expect(prismaService.transport.findFirst).toHaveBeenCalled();
    });
  });
});
