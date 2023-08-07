import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';

import { CreateUserDto, UpdateAuthDto, RegisterUserDto , LoginDto } from './dto';

import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';


@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    private jwtService: JwtService,
    ){}

  async create(createuserDto: CreateUserDto): Promise<User> {
   
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
    
    } catch (error) {
      if( error.code === 11000){
        throw new BadRequestException(`${ createuserDto.email} already exists.`);
      }else{
        throw new InternalServerErrorException('Something terrible happened');
      }
    }

  }

  async register(registerUserDto : RegisterUserDto): Promise<LoginResponse>{
      const user = await this.create(registerUserDto);

      return {
        user: user,
        token: this.getJwtToken({id : user._id}),
      }
  }


  async login(loginDto: LoginDto): Promise<LoginResponse>{
    
    const {email, password} = loginDto;

    const user = await this.userModel.findOne({ email});
    if (!user){
      throw new UnauthorizedException('Not valid credentials - email');
    }

    if (!bcryptjs.compareSync(password, user.password)){
      throw new UnauthorizedException('Not valid credentials - password');
    }

    try {
      const { password:_, ...rest } = user.toJSON();

      return {
          user: rest,
          token : this.getJwtToken({ id: user.id}),
      };  
    } catch (error) {
      throw new UnauthorizedException(error);
    }
    


  }

  
  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById(id: string){
    const user = await this.userModel.findById(id);
    const { password, ...rest} = user.toJSON();
    return rest;
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

  getJwtToken( payload: JwtPayload ){
      const token = this.jwtService.sign(payload);
      return token;
  }
}
