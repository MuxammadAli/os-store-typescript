import { Request, Response} from 'express'
import { unauthorized } from '../constants'
import { APIFeatures, generateOrderCode } from '../utils'

import Order from '../models/Order'
import { json } from 'body-parser'


export const createOrder = async (req: Request, res: Response) => {
    const { butik, product, deliveryAddress, firstName, lastName, orderedAmount, orderSum} = req.body
    const customer = req.user!.customerProfile[0]!
    const orderCode = generateOrderCode()
    try{
        await new Order({
            customer,
            butik,
            product,
            firstName,
            lastName,
            orderedAmount,
            orderSum,
            deliveryAddress,
            orderCode
        }).save()
        return res.status(200).json({ message: 'Order Success'})
    }catch (error){
        return res.status(500).json(error)
    }
}


export const deleteOrder = async (req: Request, res: Response) => {
    const { _id } = req.params
    const tokenUser = req.user!.customerProfile[0]._id
    try{
        const orderToDelete = await Order.findById(_id).orFail()
        const { outForDelivery, customer } = orderToDelete
        const isOwner = JSON.stringify(tokenUser) === JSON.stringify(customer)
        if(!isOwner){
            return res.status(401).json({
                message: 'Unauthorized'
            })
        }else if (outForDelivery) {
            return res.status(200).json({
                message: ''
            })
        }else{
            await orderToDelete?.deleteOne()
            return res.status(200).json({
                message: 'Deleted'
            })
        }
    }catch(error){
        return res.status(500).json(error)
    }
}



export const updateOrder = async (req: Request, res: Response) => {
    const { _id } = req.params
    const { deliveryAddress } = req.body
    const tokenUser = req.user!.customerProfile[0]._id
    try{
        const orderUpdate = await Order.findById(_id).orFail()
        const { approvedByButik, customer } = orderUpdate
        const isOwner = JSON.stringify(tokenUser) === JSON.stringify(customer)
        if( !isOwner){
            return res.status(401).json({ message: 'unauthorized'})
        }else if(approvedByButik) {
            return res.status(200).json({ message: ' coming soon message'})
        }else{
            if(deliveryAddress){
                await orderUpdate?.updateOne({ deliveryAddress })
            }
            return res.status(200).json({ message: 'success'})
        }
    }catch(error){
        return res.status(500).json(error)
    }
}


export const orderApprovalChange = async (req: Request, res:Response) => {
    const { _id } = req.params
    const tokenUser = req.user!.butikProfile[0]._id
    const { approvedByButik } = req.body
    try {
        const orderToUpdate = await Order.findById(_id).orFail()
        const { butik } = orderToUpdate
        const isOwner = JSON.stringify(tokenUser) === JSON.stringify(butik)
        if(!isOwner){
            return res.status(401).json({ message: unauthorized})
        }else{
            await orderToUpdate?.updateOne({
                approvedByButik
            })
            return res.status(200).json({
                message: 'Order approval success'
            })
        }
    }catch(error){
        return res.status(500).json(error)
    }
}


export const outForDeliveryChange = async (req: Request, res: Response) => {
    const { _id } = req.params
    const tokenUser = req.user!.butikProfile[0]._id
    const { outForDelivery, trackingNumber } = req.body
    try{
        const orderToUpdate = await Order.findById(_id).orFail()
        const { approvedByButik, butik } = orderToUpdate
        const isOwner = JSON.stringify(tokenUser) === JSON.stringify(butik)
        if(!isOwner){
            return res.status(401).json({ message: unauthorized })
        }else if (!approvedByButik){
            return res.status(200).json({
                message: 'error '
            })
        }else{
            await orderToUpdate?.updateOne({
                outForDelivery,
                trackingNumber
            })

            return res.status(200).json({
                message: 'success '
            })
        }
    }catch( error ){        
        return res.status(200).json(error)
    }
}