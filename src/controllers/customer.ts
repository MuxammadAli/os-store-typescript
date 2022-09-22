import { Request, Response } from 'express'
import { generateSaltAndHash } from '../utils'

import { roles } from '../constants'

import Customer from '../models/Customer'
import User from '../models/User'


export const customerRegister = async (req: Request, res: Response ) => {
    const { username, password, email, phone } = req.body
    const { salt, hash } = generateSaltAndHash(password)
    try{
        const { _id } = await new User({
            username,
            email,
            salt,
            hash,
            phone,
            role: roles.customer
        }).save()

        const customer = await new Customer({
            profileOf: _id
        }).save()
        return res.status(200).json({
            message: 'Save new Customer',
            data: customer
        })
    }catch (error) {
        return res.status(500).json(error)
    }
}