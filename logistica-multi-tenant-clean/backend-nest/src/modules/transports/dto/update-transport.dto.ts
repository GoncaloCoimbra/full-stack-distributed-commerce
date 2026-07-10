// src/modules/transports/dto/update-transport.dto.ts

import {
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransportStatus } from '@prisma/client';

/**
 * DTO para atualização de transportes
 *
 * ⚠️ IMPORTANT RULE: Products CANNOT be edited after transport creation
 *
 * Editable fields:
 * - Vehicle (vehicleId)
 * - Origin and Destination (origin, destination)
 * - Dates (departureDate, estimatedArrival)
 * - Weight and Notes (totalWeight, notes)
 * - Status (status) - with special automations for ARRIVED, DELIVERED and CANCELED
 * - Verification (actualArrival, receivedBy, receivingNotes) - used when changing ARRIVED → DELIVERED
 *
 * To change products:
 * 1. Cancel the transport (products return to stock)
 * 2. Create a new transport with the correct products
 */
export class UpdateTransportDto {
  // 🚗 VEHICLE
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    description: 'Vehicle ID (UUID)',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'Invalid VehicleId' })
  vehicleId?: string;

  // 📍 ORIGIN AND DESTINATION
  @ApiProperty({
    example: 'Lisboa',
    description: 'City/Origin location',
    required: false,
  })
  @IsOptional()
  @IsString()
  origin?: string;

  @ApiProperty({
    example: 'Porto',
    description: 'City/Destination location',
    required: false,
  })
  @IsOptional()
  @IsString()
  destination?: string;

  // 📅 DATES
  @ApiProperty({
    example: '2025-12-01',
    description: 'Departure date (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Date de partida inválida' })
  departureDate?: string;

  @ApiProperty({
    example: '2025-12-05',
    description: 'Estimated arrival date (YYYY-MM-DD)',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid arrival date' })
  estimatedArrival?: string;

  // ⚖️ WEIGHT AND NOTES
  @ApiProperty({
    example: 1500.5,
    description: 'Total load weight in kg',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Weight must be a number' })
  totalWeight?: number;

  @ApiProperty({
    example: 'Load frágil - manusear com cuidado',
    description: 'Notes about transport',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  // 📊 STATUS
  @ApiProperty({
    enum: TransportStatus,
    example: TransportStatus.IN_TRANSIT,
    required: false,
    description: `Transport status:
    - PENDING: Awaiting departure
    - IN_TRANSIT: In transit
    - ARRIVED: Arrived at destination (automatic on estimated date)
    - DELIVERED: Delivered after verification (products automatically change to APPROVED)
    - CANCELED: Canceled (products automatically return to stock)`,
  })
  @IsOptional()
  @IsEnum(TransportStatus, { message: 'Invalid status' })
  status?: TransportStatus;

  //  NEW VERIFICATION FIELDS
  @ApiProperty({
    example: '2025-12-05T14:30:00Z',
    description: 'Actual arrival date/time (filled in when verifying delivery)',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid actual arrival date' })
  actualArrival?: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Name of person who physically received the load',
    required: false,
  })
  @IsOptional()
  @IsString()
  receivedBy?: string;

  @ApiProperty({
    example: 'Load received in perfect condition. 2 pallets verified.',
    description: 'Notes about receipt',
    required: false,
  })
  @IsOptional()
  @IsString()
  receivingNotes?: string;
}
