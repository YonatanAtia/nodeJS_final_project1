const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const connectDB = require('../models/connection');
connectDB();


const Cost = require('../models/costs'); //reference to the collection costs
const User = require('../models/users'); //reference to the collection users

router.post('/add', (req, res) => {
    // Extract data from request body
    const { description, category, userid, sum, year, month, day } = req.body;

    // Create new document
    const newCost = new Cost({
        description,
        category,
        userid,
        sum,
        year,
        month,
        day
    });

    // Save to database using Promise
    newCost.save()
        .then(savedItem => {
            // Return the exact same data that was received
            const responseData = {};
            //if something is undefined - it means it has not been sent in the request
            if (description !== undefined) responseData.description = description;
            if (category !== undefined) responseData.category = category;
            if (userid !== undefined) responseData.userid = userid;
            if (sum !== undefined) responseData.sum = sum;
            if (year !== undefined) responseData.year = year;
            if (month !== undefined) responseData.month = month;
            if (day !== undefined) responseData.day = day;

            console.log('✅ Item saved successfully:', responseData);
            res.status(201).json(responseData);
        })
        .catch(error => {
            console.error('❌ Error saving item:', error);
            res.status(500).json({
                error: 'Failed to save item',
                message: error.message
            });
        });
});

router.get('/report', async function(req, res, next) {
        try {
            const id = req.query.id;
            const year = req.query.year;
            const month = req.query.month;

            const result = await Cost.aggregate([
                // שלב 1: סינון
                {
                    $match: {
                        userid: parseInt(id),
                        year: parseInt(year),
                        month: parseInt(month)
                    }
                },

                // שלב 2: קיבוץ לפי category
                {
                    $group: {
                        _id: "$category",
                        items: {
                            $push: {
                                sum: "$sum",
                                description: "$description",
                                day: "$day"
                            }
                        }
                    }
                },

                // שלב 3: איחוד כל הקטגוריות למבנה אחד
                {
                    $group: {
                        _id: null,
                        costs: {
                            $push: {
                                $arrayToObject: [[
                                    { k: "$_id", v: "$items" }
                                ]]
                            }
                        }
                    }
                },

                // שלב 4: עיצוב סופי של התוצאה
                {
                    $project: {
                        _id: 0,
                        userid: parseInt(id),
                        year: parseInt(year),
                        month: parseInt(month),
                        costs: "$costs"
                    }
                }
            ]);

            const response = {
                userid: parseInt(id),
                year: parseInt(year),
                month: parseInt(month),
                costs: result[0]?.costs || []
            };

            res.json(response);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

module.exports = router;
