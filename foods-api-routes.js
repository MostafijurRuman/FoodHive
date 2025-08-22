// Add these routes to your existing Express server

// Get all foods with pagination and filtering
app.get('/foods', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'dateAdded';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    const skip = (page - 1) * limit;
    
    // Build query
    let query = { status: 'available' };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder;
    
    const foods = await foodsCollection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await foodsCollection.countDocuments(query);
    
    res.json({
      foods,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ message: 'Error fetching foods' });
  }
});

// Add new food (Protected route - requires JWT verification middleware)
app.post('/foods', verifyJWT, async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      price,
      quantity,
      origin,
      ingredients,
      description,
      madeBy,
      addedBy
    } = req.body;
    
    // Validate required fields
    if (!name || !image || !category || !price || !quantity || !origin || !ingredients || !madeBy) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['name', 'image', 'category', 'price', 'quantity', 'origin', 'ingredients', 'madeBy']
      });
    }
    
    // Validate data types
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number' });
    }
    
    if (typeof quantity !== 'number' || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }
    
    // Validate URL format for image
    try {
      new URL(image);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid image URL format' });
    }
    
    const newFood = {
      name: name.trim(),
      image: image.trim(),
      category: category.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity),
      origin: origin.trim(),
      ingredients: ingredients.trim(),
      description: description?.trim() || '',
      madeBy: madeBy.trim(),
      addedBy: {
        name: addedBy.name || 'Anonymous',
        email: addedBy.email,
        uid: addedBy.uid
      },
      dateAdded: new Date().toISOString(),
      status: 'available',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await foodsCollection.insertOne(newFood);
    
    if (result.insertedId) {
      const createdFood = await foodsCollection.findOne({ _id: result.insertedId });
      
      res.status(201).json({
        message: 'Food item added successfully',
        food: createdFood
      });
    } else {
      res.status(500).json({ message: 'Failed to add food item' });
    }
  } catch (error) {
    console.error('Error adding food:', error);
    res.status(500).json({ message: 'Error adding food item' });
  }
});

// Get foods by user (Protected route)
app.get('/my-foods', verifyJWT, async (req, res) => {
  try {
    const userEmail = req.decoded.email; // Assuming your JWT middleware sets req.decoded
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const foods = await foodsCollection
      .find({ 'addedBy.email': userEmail })
      .sort({ dateAdded: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await foodsCollection.countDocuments({ 'addedBy.email': userEmail });
    
    res.json({
      foods,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user foods:', error);
    res.status(500).json({ message: 'Error fetching your foods' });
  }
});

// Get single food by ID
app.get('/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid food ID' });
    }
    
    const food = await foodsCollection.findOne({ _id: new ObjectId(id) });
    
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    
    res.json(food);
  } catch (error) {
    console.error('Error fetching food:', error);
    res.status(500).json({ message: 'Error fetching food' });
  }
});

// Update food (Protected route)
app.put('/foods/:id', verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.decoded.email;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid food ID' });
    }
    
    // Check if food exists and belongs to user
    const existingFood = await foodsCollection.findOne({ 
      _id: new ObjectId(id),
      'addedBy.email': userEmail 
    });
    
    if (!existingFood) {
      return res.status(404).json({ message: 'Food not found or access denied' });
    }
    
    const updateData = { ...req.body };
    delete updateData._id; // Remove _id if present
    delete updateData.addedBy; // Prevent changing addedBy
    updateData.updatedAt = new Date();
    
    const result = await foodsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.modifiedCount > 0) {
      const updatedFood = await foodsCollection.findOne({ _id: new ObjectId(id) });
      res.json({
        message: 'Food updated successfully',
        food: updatedFood
      });
    } else {
      res.status(400).json({ message: 'No changes made' });
    }
  } catch (error) {
    console.error('Error updating food:', error);
    res.status(500).json({ message: 'Error updating food' });
  }
});

// Delete food (Protected route)
app.delete('/foods/:id', verifyJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.decoded.email;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid food ID' });
    }
    
    // Check if food exists and belongs to user
    const existingFood = await foodsCollection.findOne({ 
      _id: new ObjectId(id),
      'addedBy.email': userEmail 
    });
    
    if (!existingFood) {
      return res.status(404).json({ message: 'Food not found or access denied' });
    }
    
    const result = await foodsCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount > 0) {
      res.json({ message: 'Food deleted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to delete food' });
    }
  } catch (error) {
    console.error('Error deleting food:', error);
    res.status(500).json({ message: 'Error deleting food' });
  }
});

// Get food categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await foodsCollection.distinct('category');
    res.json(categories.sort());
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

/* 
NOTES FOR INTEGRATION:

1. Make sure you have these variables in your existing server:
   - foodsCollection (MongoDB collection reference)
   - verifyJWT (your JWT verification middleware)
   - ObjectId (from MongoDB)

2. If your JWT middleware uses different property names, update:
   - req.decoded.email (change to match your JWT payload structure)
   - req.decoded.uid (if you use uid instead of email)

3. Add this index to your MongoDB foods collection for better search performance:
   db.foods.createIndex({ "name": "text", "ingredients": "text", "description": "text" })
   db.foods.createIndex({ "addedBy.email": 1 })
   db.foods.createIndex({ "category": 1 })

4. The food data structure matches exactly what your frontend AddFood page sends
*/
