const { Schema, model } = require("mongoose"); // Erase if already required
const slugfify = require('slugify')

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

var productSchema = new Schema(
  {
    product_name: { type: String, required: true},
    product_thumb: { type: String, required: true},
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true},
    product_quantity: { type: Number, required: true},
    product_type: { type: String, required: true, enum: ["Electronics", "Clothing", "Furniture"]},
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop"},
    product_attributes: { type: Schema.Types.Mixed, required: true},
    product_ratingAverage: { 
      type: Number, 
      default: 4.5, 
      min: [1, 'Rating must be above 1.0'], 
      max: [5, 'Rating must be belove 5.0'], 
      set: (val) => Math.round(val * 10) / 10
    },
    product_variations: { type: Array, default: []},
    isDraft: { type: Boolean, default: true, index: true, select: false},
    isPublished: { type: Boolean, default: false, index: true, select: false}
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
// create index for search
productSchema.index({product_name: 'text', product_description: 'text'})

// define the product type  = clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  {
    collection: "Clothes",
    timeseries: true,
  }
);

// define the product type  = electronic
const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  {
    collection: "Electronics",
    timeseries: true,
  }
);

// define the product type  = electronic
const furnitureSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  {
    collection: "Furnitures",
    timeseries: true,
  }
);

// Document Middleware run before .save() and .create()
productSchema.pre('save', function(next) {
  this.product_slug = slugfify(this.product_name, { lower: true })
  next();
})

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model("Electronic", electronicSchema),
  clothing: model("Clothes", clothingSchema),
  furniture: model("Furniture", furnitureSchema),
};
