const express = require('express');
const router = express.Router();


const connectDB = require('../models/connection');
connectDB();


const Cost = require('../models/costs'); //reference to the collection costs
const User = require('../models/users'); //reference to the collection users



/**
 * Route to add a new cost item.
 *
 * @name POST /add
 * @function
 * @param {express.Request} req - Express request object.
 * @param {Object} req.body - Cost details.
 * @param {string} req.body.description - Description of the cost.
 * @param {string} req.body.category - Category of the cost.
 * @param {number} req.body.userid - User ID associated with the cost.
 * @param {number} req.body.sum - Amount of the cost.
 * @param {number} [req.body.year] - Year of the cost (Default - current year).
 * @param {number} [req.body.month] - Month of the cost (Default - current month).
 * @param {number} [req.body.day] - Day in month of the cost (Default - current day).
 * @param {express.Response} res - Express response object.
 *
 * @returns {Promise<void>} Sends JSON response with the added cost data or error message.
 */

router.post('/add',async (req, res) => {
    try {
        // Extract data from request body
        const {description, category, userid, sum, year, month, day} = req.body;

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
        const savedItem = await newCost.save();

        // Update or create user in users collection
        if (userid && sum) {
            let user = await User.findOne({id: userid});

            if (user) {
                // if user exists - add sum to existing total
                user.total = (user.total || 0) + sum;
                await user.save();
                console.log(`Updated user ${userid} total to: ${user.total}`);
            } else {
                // if user does not exist - create new user
                const newUser = new User({
                    id: userid,
                    total: sum
                });
                await newUser.save();
                console.log(`Created new user ${userid} with total: ${sum}`);
            }
        }

        // Return the exact same data that was received
        const responseData = {};
        responseData.description = description;
        responseData.category = category;
        responseData.userid = userid;
        responseData.sum = sum;
        //if something is undefined - it means it has not been sent in the request
        if (year !== undefined) responseData.year = year;
        if (month !== undefined) responseData.month = month;
        if (day !== undefined) responseData.day = day;

        console.log('Item saved successfully:', responseData);
        res.status(201).json(responseData);

        //Error handling
    } catch (error) {
        console.error('❌ Error saving item:', error);
        res.status(500).json({
            error: 'Failed to save item',
            message: error.message
        });
    }
});

/**
 * Route to get a report of costs grouped by category for a specific user and time period (specific year and month).
 *
 * @name GET /report
 * @function
 * @param {express.Request} req - Express request object.
 * @param {string} req.query.id - User ID to filter costs.
 * @param {string} req.query.year - Year to filter costs.
 * @param {string} req.query.month - Month to filter costs.
 * @param {express.Response} res - Express response object.
 *
 * @returns {Promise<void>} JSON object with grouped costs by category or error.
 */
router.get('/report',
    async function (req, res, next) {
        try {
            const id = req.query.id;
            const year = req.query.year;
            const month = req.query.month;

            const result = await Cost.aggregate([
                // Step 1: Filter documents by user id, year and month
                {
                    $match: {
                        userid: parseInt(id),
                        year: parseInt(year),
                        month: parseInt(month)
                    }
                },

                // Step 2: Group documents by "category"
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

                // Step 3: Combine all category groups into a single document with a "costs" array
                {
                    $group: {
                        _id: null,
                        costs: {
                            $push: {
                                $arrayToObject: [[
                                    {k: "$_id", v: "$items"}
                                ]]
                            }
                        }
                    }
                },

                // Step 4: Final formatting of the output document
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

            // Define required categories
            const requiredCategories = ["food", "health", "housing", "sport", "education"];
            const categoryMap = {};

            // Convert costs array of objects [{category: items}, ...] into a dictionary {category: items}
            if (result && result.length > 0) {
                (result[0]?.costs || []).forEach(group => {
                    const [category, items] = Object.entries(group)[0];
                    categoryMap[category] = items;
                });
            }

            // Prepare an array ensuring all required categories exist in the result
            // If a category is missing, it will have an empty array as value
            const costs = requiredCategories.map(cat => ({
                [cat]: categoryMap[cat] || []
            }));

            // Response object - always returns JSON with categories
            const response = {
                userid: parseInt(id),
                year: parseInt(year),
                month: parseInt(month),
                costs: costs
            };

            // Sending the response - always succeeds with status 200
            res.json(response);

        } catch (error) { //Error handling
            res.status(500).json({error: error.message});
        }
    });

/**
 * Route to get user details (including user's total costs) by ID.
 *
 * @name GET /users/:id
 * @function
 * @param {express.Request} req - Express request object.
 * @param {string} req.params.id - User ID.
 * @param {express.Response} res - Express response object.
 *
 * @returns {Promise<void>} JSON object with user details or error.
 */
router.get('/users/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await User.findOne({ id });
        //The user sent does not exist
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            id,
            first_name: user.first_name,
            last_name: user.last_name,
            total: user.total || 0 //if doesn't exist - returs 0 and not undefined
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/**
 * Route to get information about the team members.
 *
 * @name GET /about
 * @function
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 *
 * @returns {Promise<void>} JSON array with team member objects.
 */
router.get('/about', async (req, res) => {
    try {
        const team =
            [
                {
                    "first_name": "Idan",
                    "last_name": "Yefet"
                },
                {
                    "first_name": "Yonatan",
                    "last_name": "Atia"
                }
            ]
        res.json(team);
    } catch (err) { //Error handling
        res.status(500).json({ error: err.message });
    }
});




module.exports = router;
