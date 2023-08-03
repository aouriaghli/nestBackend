import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>
    ){}

  async create(createuserDto: CreateUserDto): Promise<User> {
    //console.log({createuserDto});

    // const newUser = new this.userModel( createuserDto);
    // return newUser.save();
    //return 'This action adds a new auth';


    
    try {

    // 1-Encriptar la contraeña

    // Hago desestructuracion, para separa el password del resto del objeto dto
    const {password, ...userData} = createuserDto;
    
    // creo el nuevo objeto, con el password encriptado.
    const newUser = new this.userModel({
      password: bcryptjs.hashSync(password, 10),
      ...userData
    });
    
    // 2-Guardar el usuario
    await newUser.save();
    const { password: _, ...user} =  newUser.toJSON(); // el guion bajo _ es para renombrar ya que  ya hay otra variable password un poco mas arriba, es para que sepa que son distintas
    return user;
    
    // 3-Generar el JWT

    } catch (error) {
      if( error.code === 11000){
        throw new BadRequestException(`${ createuserDto.email} already exists.`);
      }else{
        throw new InternalServerErrorException('Something terrible happened');
      }
    }

  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
