import { Birdhouse, Residency } from '&/domain/entities';
import {
  BirdhouseRepository,
  ResidencyRepository,
} from '&/domain/repositories';
import {
  EntityCreateFailedException,
  EntityNotFoundException,
  EntityUpdateFailedException,
} from '&/domain/repositories/exceptions';
import { LoggerService } from '&/logger/logger.service';
import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { RegisterDto, UpdateHouseDto } from '../dto';
import { AddResidencyDto } from '../dto/add-residency.dto';
import {
  BirdhouseNotFoundException,
  BirdhouseUpdateFailedException,
} from '../exceptions';

@Injectable()
export class BirdService {
  constructor(
    @Inject(BirdhouseRepository)
    private readonly birdhouseRepo: BirdhouseRepository,
    @Inject(ResidencyRepository)
    private readonly residencyRepo: ResidencyRepository,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('BIRD ACTION');
  }

  public async createBirdhouse(
    registerDto: RegisterDto,
  ): Promise<Birdhouse> | never {
    const ubid = uuid();

    const birdhouse = new Birdhouse(
      undefined,
      ubid,
      registerDto.name,
      registerDto.longitude,
      registerDto.latitude,
      null,
    );

    try {
      const createdHouse = await this.birdhouseRepo.create(birdhouse);
      this.logger.log({
        message: 'Birdhouse created',
        birdhouse: createdHouse,
      });
      return createdHouse;
    } catch (e) {
      if (e instanceof EntityCreateFailedException) {
        // TODO: Handle this
      }
      throw e;
    }
  }

  public async updateBirdhouse(
    id: string,
    updateHouseDto: UpdateHouseDto,
  ): Promise<Birdhouse> | never {
    try {
      const birdhouse = await this.birdhouseRepo.update({ id }, updateHouseDto);
      this.logger.log({
        message: 'Birdhouse updated',
        birdhouse,
      });
      return birdhouse;
    } catch (e) {
      if (e instanceof EntityUpdateFailedException) {
        throw new BirdhouseUpdateFailedException(id);
      } else if (e instanceof EntityNotFoundException) {
        throw new BirdhouseNotFoundException(id);
      }
      throw e;
    }
  }

  public async addResidency(
    birdhouseId: string,
    residencyDto: AddResidencyDto,
  ): Promise<Birdhouse> | never {
    let birdhouse = await this.birdhouseRepo.findOne({ id: birdhouseId });
    if (!birdhouse) throw new BirdhouseNotFoundException(birdhouseId);

    let residency = new Residency(
      undefined,
      birdhouseId,
      residencyDto.birds,
      residencyDto.eggs,
    );

    try {
      residency = await this.residencyRepo.create(residency);
    } catch (e) {
      if (e instanceof EntityCreateFailedException) {
        // TODO: Handle error
      }
      throw e;
    }

    try {
      birdhouse = await this.birdhouseRepo.update(
        { id: birdhouseId },
        { residencyId: residency.id },
      );
    } catch (e) {
      // TODO: handle this
    }

    birdhouse.residency = residency;

    this.logger.log({
      message: 'Residency added',
      birdhouse,
      residency,
    });

    return birdhouse;
  }
}
