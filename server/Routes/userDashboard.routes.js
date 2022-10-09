const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ProductModel } = require("../Modal/product.module.js");
const { CartModel } = require("../Modal/Cart.module.js");
require("dotenv").config();

const userProductController = Router();

// userProductController.get("/", async (req, res) => {
// 	const product = await ProductModel.find();
// 	res.status(200).json(product);
// });
userProductController.get("/cart", async (req, res) => {
	const product = await CartModel.find({ userEmail: req.body.userEmail });

	res.status(200).json(product);
});

userProductController.post("/create", async (req, res) => {
	const {
		userEmail,
		_id,
		prod_name,
		prod_cat,
		prod_price,
		prod_rating,
		prod_desc,
		prod_tag,
		prod_image,
		prod_discount
	} = req.body;
	let alreadyData = await CartModel.findOne({
		userEmail: req.body.userEmail,
		prod_id: _id
	});
	if (alreadyData) {
		return res.status(200).send({ message: "Product is already present" });
	}

	const product = new CartModel({
		prod_id: _id,
		userEmail: userEmail,
		prod_name,
		prod_cat,
		prod_price,
		prod_rating,
		prod_desc,
		prod_tag,
		prod_discount,
		prod_image
	});
	try {
		await product.save();
		res.status(200).send({ message: "Product added Successfully" });
	} catch (error) {
		console.log("error: ", error);
		res.status(500).send({ error: error });
	}
});

userProductController.delete("/delete/:id", async (req, res) => {
	const { id } = req.params;
	console.log("id: ", id);
	const { userEmail } = req.body;
	try {
		await CartModel.findOneAndDelete({
			prod_id: id,
			userEmail
		});
		res.status(200).send({ message: "Product delete successfully" });
	} catch (error) {
		res.status(500).send(error);
	}
});
module.exports = { userProductController };
