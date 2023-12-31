import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { Repository } from 'typeorm';
import { simpleEncrypt } from 'src/utils/hash';

const encryptionKey = 'mysecretkey';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    let user = new UsersEntity();
    user.name = createUserDto.name;
    user.user_type = createUserDto.user_type;
    user.nic = createUserDto.nic;
    user.password = simpleEncrypt(
      createUserDto.password.toLowerCase(),
      encryptionKey,
    );
    user = await this.usersRepository.create(user);
    await this.usersRepository.save(user);
    return user;
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOne(id: number) {
    return await this.usersRepository.findOne({ where: { id: id } });
  }

  async findOneByNic(nic: string) {
    return await this.usersRepository.findOne({ where: { nic: nic } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    updateUserDto.password = simpleEncrypt(
      updateUserDto.password,
      encryptionKey,
    );
    await this.usersRepository.update({ id }, updateUserDto);
    return await this.usersRepository.findOne({ where: { id: id } });
  }

  async remove(id: number) {
    await this.usersRepository.delete({ id });
    return { deleted: true };
  }

  async findByNic(nic: string): Promise<UsersEntity | undefined> {
    return this.usersRepository.findOne({ where: { nic } });
  }

  async findAllBySearch(query: string): Promise<UsersEntity[]> {
    return this.usersRepository
      .createQueryBuilder('users')
      .where('users.name LIKE :query OR users.nic LIKE :query', {
        query: `%${query}%`,
      })
      .getMany();
  }
}
