import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { google, Auth } from 'googleapis';
import { UserService } from '../user/user.service';
import { DataSource, Repository } from 'typeorm';
import { AuthProvider, User } from 'src/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { ADMIN_DATASOURCE } from 'src/core';

@Injectable()
export class GoogleService {
  oauthClient: Auth.OAuth2Client;
  userRepository: Repository<User>;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    @Inject(forwardRef(() => ADMIN_DATASOURCE))
    dataSource: DataSource,
  ) {
    this.userRepository = dataSource.getRepository(User);

    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async authenticate(token: string) {
    const { email } = await this.oauthClient.getTokenInfo(token);

    const user = await this.userRepository.findOneBy({ email });

    if (user) {
      return this.handleRegisteredUser(user);
    } else {
      return this.registerUser(token, email);
    }
  }

  async registerUser(token: string, email: string) {
    const { name } = await this.getUserData(token);
    const user = await this.userService.create({
      email,
      emailVerifiedAt: new Date(),
      name,
      isActive: true,
      provider: AuthProvider.GOOGLE,
    });
    return this.handleRegisteredUser(user);
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });

    return userInfoResponse.data;
  }

  async handleRegisteredUser(user: User) {
    return this.authService.createJwtToken(user);
  }
}
