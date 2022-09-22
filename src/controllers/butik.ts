import { Request, Response } from 'express'
import { click, generateSaltAndHash } from '../utils'

import { roles } from '../constants'
import { APIFeatures } from '../utils/ApiFeatures'

import Butik from '../models/Butik'
import User from '../models/User'
import { orders, products } from '../types'
import { calculateTotalClicks } from '../utils/helpers'


export const butikRegister = async (req:Request, res: Response) => {
    const {butik_name, butik_image, username, password, email, phone} = req.body

    const { salt, hash} = generateSaltAndHash(password)
    try{
        const {_id} = await new User({
            username,
            email,
            salt,
            hash,
            phone,
            role: roles.butik
        }).save()

        const butik = await new Butik({
            butik_name,
            butik_image,
            profileOf: _id
        }).save()

        return res.status(200).json({ message: 'New butik Saved', data: butik})
    }catch(error: any){
        return res.status(500).json(error)
    }
}

export const listButiks = async (req: Request, res: Response) => {
    try{
        const API = new APIFeatures(Butik.find(), req.query)
           .filter()
           .sort()
           .limitFields()
           .paginate()
        const result: [] = await API.query
        return res.status(200).json({ status: 'OK', count: result.length, butiks: result})
    }catch(error){
        return res.status(500).json(error)
    }
}


export const getButik = async (req: Request, res: Response) => {
    try{
        const { butikId } = req.params

        const butik = await Butik.findById(butikId).populate('products')
        return res.status(200).json({ status: 'OK', butik})
    }catch(error){
        return res.status(500).json(error)
    }
}


export const listButikProducts = async (req: Request, res: Response) => {
    const butik = req.user!.butikProfile[0]
    const { products } = await butik.populate('products')
    return res.status(200).json({ data: products})
}


export const homeStats = async(req: Request, res: Response) => {
    try{
        const butik = req.user!.butikProfile[0]
        const butikVisitCount = calculateTotalClicks(butik.visits)
        const orders: orders = (await butik.populate('orders')).orders
        const products: products = ( await butik.populate('products')).products
        const clickCount = products.length > 0 ? products.map((product) => calculateTotalClicks(product.clicks)).reduce((a, b) =>  a + b) : 0
        const instagramClickCount = products.length > 0 ? products.map((product) => calculateTotalClicks(product.instagramClicks)).reduce((a, b) => a + b): 0
        const totalProductClickCount = clickCount + instagramClickCount

        const orderedProducts: orders = []
        if(orders.length > 0){
            for await (const order of orders){
                const populated = await order.populate('product')
                orderedProducts.push(populated)
            }
        }

        const totalTurnOver = orderedProducts.length > 0 ? orderedProducts.map((ordered) => ordered.product)
        .map((product: any) => product.price)
        .reduce((a, b) => a + b) : 0

        const statsObject = {
            butikVisitCount, 
            orderCount: orders.length,
            productCount: products.length,
            totalProductClickCount,
            instagramClickCount,
            totalTurnOver,
        }
        return res.status(200).json(statsObject)
    }catch(error){
        return res.status(500).json(error)
    }
}


export const butikVisit = async (req: Request, res: Response) => {
    const { butikId,  field} = req.params
    try{
        await click(Butik, butikId, field)
        return res.status(200).json({message: 'Success'})
    }catch(error){
        return res.status(500).json(error)
    }
}


export const listButikProductsById = async (req: Request, res: Response) => {
    try{
        const {butikId} = req.params
        const { products } = await Butik.findById(butikId).populate('products')
        return res.status(200).json({ count: products.length, result: products })
    }catch(error){
        return res.status(500).json(error)
    }
}
