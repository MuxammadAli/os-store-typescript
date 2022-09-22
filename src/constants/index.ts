import { join } from 'path'
import { RedisClientOptions } from 'redis'
import { SchemaTypes, SchemaDefinitionProperty, Types } from 'mongoose'

export const roles = {
    customer: 'Guest',
    admin: 'Admin',
    butik: 'butik',
}

export const models = {
    butik: 'ButikProfile',
    customer: 'CustomerProfile',
    product: 'Product',
    review: 'Review',
    user: 'User',
    order: 'Order',
}

export const collections = {
    product: 'Product',
    user: 'Users',
    butik: 'butik Profiles',
    customer: 'Guest Profiles',
    review: 'Reviews',
    order: 'Orders',
}

export const unauthorized = 'You are not authorized to perform this action.'

export const secretPath = join(__dirname, '..', 'secret')
export const privateKeyPath = join(secretPath, 'PRIV_KEY.pem')
export const publicKeyPath = join(secretPath, 'PUB_KEY.pem')
export const DEVELOPMENT = 'DEVELOPMENT'
export const PRODUCTION = 'PRODUCTION'
export const LOCAL_HOST = 'localhost'
export const REDIS_CLIENT = 'server-redis'
export const REDIS_DEVELOPMENT_OPTIONS = {
    host: LOCAL_HOST,
    port: 6379,
} as RedisClientOptions
export const REDIS_PRODUCTION_OPTIONS = {
    host: REDIS_CLIENT,
    port: 6379,
} as RedisClientOptions
export const clickSchema = {
    date: SchemaTypes.String,
    day: SchemaTypes.String,
    month: SchemaTypes.String,
    count: SchemaTypes.Number,
} as SchemaDefinitionProperty

export const guestUser = new Types.ObjectId()