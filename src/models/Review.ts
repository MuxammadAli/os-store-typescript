import { Schema, SchemaTypes, model } from "mongoose";

import { collections, models } from "../constants";

import { Review as IReview } from "../types";

const Review: Schema = new Schema(
    {
        customer: {
            type: SchemaTypes.ObjectId,
            required: true,
            ref: models.customer,
        },
        product: {
            type: SchemaTypes.ObjectId,
            required: true,
            ref: models.product
        },
        rating: {
            type: SchemaTypes.Number,
            required: true,
            min: 1,
            max: 5,
        },
        text: {
            type: SchemaTypes.String,
            required: true,
            maxlength: 255,
            trim: true
        },
    },
    { timestamps: true, collection: collections.review}
)

export default model<IReview>(models.review, Review)