const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

var ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
    },

    images: {
      type: String,
      required: true,
    },

    ratings: {
      type: Number,
      requierd: true,
    },
    percentOff: {
      type: Number,
      requierd: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate a slug from the product's name before saving
ProductSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("DealsProduct", ProductSchema);
