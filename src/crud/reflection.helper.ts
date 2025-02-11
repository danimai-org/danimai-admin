import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum';
import {
  INTERCEPTORS_METADATA,
  METHOD_METADATA,
  PARAMTYPES_METADATA,
  PATH_METADATA,
  ROUTE_ARGS_METADATA,
} from '@nestjs/common/constants';
import { ArgumentsHost } from '@nestjs/common';
import {
  ACTION_NAME_METADATA,
  CRUD_OPTIONS_METADATA,
  OVERRIDE_METHOD_METADATA,
  PARSED_BODY_METADATA,
} from '../contants';
import { BaseRoute, CrudOptions } from '../interfaces';
import { CrudActions } from '../enum/crud-actions.enum';
import { BaseRouteName } from '../types';
import { isFunction } from '@nestjsx/util';

export class R {
  static set(
    metadataKey: any,
    metadataValue: any,
    target: unknown,
    propertyKey: string | symbol = undefined,
  ) {
    if (propertyKey) {
      Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey);
    } else {
      Reflect.defineMetadata(metadataKey, metadataValue, target);
    }
  }

  static get<T>(
    metadataKey: any,
    target: unknown,
    propertyKey: string | symbol = undefined,
  ): T {
    return propertyKey
      ? Reflect.getMetadata(metadataKey, target, propertyKey)
      : Reflect.getMetadata(metadataKey, target);
  }

  static createRouteArg(
    paramtype: RouteParamtypes,
    index: number,
    /* istanbul ignore next */
    pipes: any[] = [],
    data = undefined,
  ): any {
    return {
      [`${paramtype}:${index}`]: {
        index,
        pipes,
        data,
      },
    };
  }

  static setDecorators(
    decorators: (PropertyDecorator | MethodDecorator)[],
    target: any,
    name: string,
  ) {
    // this makes metadata decorator works
    const decoratedDescriptor = Reflect.decorate(
      decorators,
      target,
      name,
      Reflect.getOwnPropertyDescriptor(target, name),
    );

    // this makes proxy decorator works
    Reflect.defineProperty(target, name, decoratedDescriptor);
  }

  static setBodyArg(
    index: number,
    /* istanbul ignore next */ pipes: any[] = [],
  ) {
    return R.createRouteArg(RouteParamtypes.BODY, index, pipes);
  }

  static setCrudOptions(options: CrudOptions<any>, target: any) {
    R.set(CRUD_OPTIONS_METADATA, options, target);
  }

  static setRoute(route: BaseRoute, func: unknown) {
    R.set(PATH_METADATA, route.path, func);
    R.set(METHOD_METADATA, route.method, func);
  }

  static setInterceptors(interceptors: any[], func: unknown) {
    R.set(INTERCEPTORS_METADATA, interceptors, func);
  }

  static setRouteArgs(metadata: any, target: any, name: string) {
    R.set(ROUTE_ARGS_METADATA, metadata, target, name);
  }

  static setRouteArgsTypes(metadata: any, target: any, name: string) {
    R.set(PARAMTYPES_METADATA, metadata, target, name);
  }

  static setAction(action: CrudActions, func: unknown) {
    R.set(ACTION_NAME_METADATA, action, func);
  }

  static getCrudOptions(target: any): CrudOptions<any> {
    return R.get(CRUD_OPTIONS_METADATA, target);
  }

  static getAction(func: unknown): CrudActions {
    return R.get(ACTION_NAME_METADATA, func);
  }

  static getOverrideRoute(func: unknown): BaseRouteName {
    return R.get(OVERRIDE_METHOD_METADATA, func);
  }

  static getInterceptors(func: unknown): any[] {
    return R.get(INTERCEPTORS_METADATA, func) || [];
  }

  static getRouteArgs(target: any, name: string): any {
    return R.get(ROUTE_ARGS_METADATA, target, name);
  }

  static getRouteArgsTypes(target: any, name: string): any[] {
    return (
      R.get(PARAMTYPES_METADATA, target, name) || /* istanbul ignore next */ []
    );
  }

  static getParsedBody(func: unknown): any {
    return R.get(PARSED_BODY_METADATA, func);
  }

  static getContextRequest(ctx: ArgumentsHost): any {
    return isFunction(ctx.switchToHttp)
      ? ctx.switchToHttp().getRequest()
      : /* istanbul ignore next */ ctx;
  }
}
