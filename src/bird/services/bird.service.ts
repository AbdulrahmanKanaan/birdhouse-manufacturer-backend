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
import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { RegisterDto, UpdateHouseDto } from '../dto';
import {
  BirdhouseNotFoundException,
  BirdhouseUpdateFailedException,
} from '../exceptions';
import { AddResidencyDto } from '../dto/add-residency.dto';

@Injectable()
export class BirdService {
  constructor(
    @Inject(BirdhouseRepository)
    private readonly birdhouseRepo: BirdhouseRepository,
    @Inject(ResidencyRepository)
    private readonly residencyRepo: ResidencyRepository,
  ) {}

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
    );

    try {
      return await this.birdhouseRepo.create(birdhouse);
    } catch (e) {
      if (e instanceof EntityCreateFailedException) {
        console.log(e.error?.message);
      }
      throw e;
    }
  }

  public async updateBirdhouse(
    id: string,
    updateHouseDto: UpdateHouseDto,
  ): Promise<Birdhouse> | never {
    try {
      return await this.birdhouseRepo.update({ id }, updateHouseDto);
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
    const birdhouse = await this.birdhouseRepo.findOne({ id: birdhouseId });
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
        console.log(123, e.error?.message);
      }
      throw e;
    }

    birdhouse.residency = residency;

    return birdhouse;
  }

  public async getBirdhouse(id: string): Promise<Birdhouse> | never {
    const birdhouse = await this.birdhouseRepo.findOne({ id });
    if (!birdhouse) throw new BirdhouseNotFoundException(id);

    const residency = await this.residencyRepo.getLatestResidency(id);
    if (residency) {
      birdhouse.residency = residency;
    }

    return birdhouse;
  }
}
