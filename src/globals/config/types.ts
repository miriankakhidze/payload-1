import React from 'react';
import { Model, Document } from 'mongoose';
import { DeepRequired } from 'ts-essentials';
import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { PayloadRequest } from '../../express/types';
import { Access, Endpoint, EntityDescription, GeneratePreviewURL } from '../../config/types';
import { Field } from '../../fields/config/types';
import { IncomingGlobalVersions, SanitizedGlobalVersions } from '../../versions/types';

export type TypeWithID = {
  id: string
}

export type BeforeValidateHook = (args: {
  data?: any;
  req?: PayloadRequest;
  originalDoc?: any;
}) => any;

export type BeforeChangeHook = (args: {
  data: any;
  req: PayloadRequest;
  originalDoc?: any;
}) => any;

export type AfterChangeHook = (args: {
  doc: any;
  previousDoc: any;
  req: PayloadRequest;
}) => any;

export type BeforeReadHook = (args: {
  doc: any;
  req: PayloadRequest;
}) => any;

export type AfterReadHook = (args: {
  doc: any
  req: PayloadRequest
  query?: { [key: string]: any }
  findMany?: boolean
}) => any;

export interface GlobalModel extends Model<Document> {
  buildQuery: (query: unknown, locale?: string) => Record<string, unknown>
}

export type GlobalConfig = {
  slug: string
  label?: Record<string, string> | string
  graphQL?: {
    name?: string
  }
  /**
   * Options used in typescript generation
   */
  typescript?: {
    /**
     * Typescript generation name given to the interface type
     */
    interface?: string
  }
  preview?: GeneratePreviewURL
  versions?: IncomingGlobalVersions | boolean
  hooks?: {
    beforeValidate?: BeforeValidateHook[]
    beforeChange?: BeforeChangeHook[]
    afterChange?: AfterChangeHook[]
    beforeRead?: BeforeReadHook[]
    afterRead?: AfterReadHook[]
  }
  endpoints?: Omit<Endpoint, 'root'>[],
  access?: {
    read?: Access;
    readDrafts?: Access;
    readVersions?: Access;
    update?: Access;
  }
  fields: Field[];
  admin?: {
    description?: EntityDescription;
    group?: Record<string, string> | string;
    hideAPIURL?: boolean;
    components?: {
      views?: {
        Edit?: React.ComponentType<any>
      }
    }
  }
}

export interface SanitizedGlobalConfig extends Omit<DeepRequired<GlobalConfig>, 'fields' | 'versions'> {
  fields: Field[]
  versions: SanitizedGlobalVersions
}

export type Globals = {
  Model: GlobalModel
  config: SanitizedGlobalConfig[]
  graphQL?: {
    [slug: string]: {
      type: GraphQLObjectType
      mutationInputType: GraphQLNonNull<any>
      versionType?: GraphQLObjectType
    }
  }
}
