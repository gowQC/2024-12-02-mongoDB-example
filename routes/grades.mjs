import express from "express";
import { ObjectId } from "mongodb";
import db from "../db/conn.mjs";

const router = express.Router();

// full CRUD functionality
// C - Create - POST
// R - Read - GET
// U - Update - PUT OR PATCH
// D - Delete - DELETE

// For read, we usually do an index route and a show route
//  Index displays or gets many db items
//  Show displays one, usually based on the id

//  -------------------------------------------------------------------------------
//              ALL ROUTES
//  -------------------------------------------------------------------------------

// ========== Get implements READ functionality ==========
//      we want to be careful with this get route
//          because it could be a huge amount of data
//      that is why we limit to 50 in this example
//          if you wanted to either use pagination or
//          somehow iterate through, you might combine limit(n) and skip(m)
// ===== make sure that you are using async-await
// because db access requests are asynchronous, but we need that data
// before we move on
router
  .route("/")
  .get(async (req, res) => {
    const collection = await db.collection("grades");

    const results = await collection.find({}).limit(50).toArray();

    if (!results) res.send("not found").status(404);
    else res.send(results).status(200);
  }) // post implements CREATE functionality
  .post(async (req, res) => {
    const collection = await db.collection("grades");

    const newDocument = req.body;
    // this is verifying the body is coming from Postman
    // console.log(newDocument);

    const result = await collection.insertOne(newDocument);
    if (!result) {
      res.send("Resource not created").status(500);
    } else {
      res.send("Resource successfully created").status(201);
    }
  });

// The show route is READ, but limiting to a specific entry
// in this case, we'll use id to get a specific grades entry
router
  .route("/:id")
  .get(async (req, res) => {
    // in the connection, remember that we have already accessed the sample training db
    // now we are going to access the 'grades' collection in that db
    const collection = await db.collection("grades");

    // define the query
    // in this, we are searching for a specific id
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await collection.findOne(query);

      if (!result) {
        res.send("Resource not found").status(404);
      } else {
        res.send(result).status(200);
      }
    } catch (err) {
      res.send(`${req.params.id} is not an active ID`).status(400);
    }
  })
  .delete(async (req, res) => {
    const collection = db.collection("grades");
    const query = { _id: new ObjectId(req.params.id) };
    const results = await collection.deleteOne(query);
    if (!results) res.send("not found").status(404);
    else res.send(results).status(200);
  });

router.route("/student/:student_id").get(async (req, res) => {
  const collection = await db.collection("grades");
  const query = { student_id: Number(req.params.student_id) };
  console.log(query);

  // an array because we're expecting more than one result
  const results = await collection.find(query).toArray();
  if (!results) res.send("not found").status(404);
  else res.send(results).status(200);
});

export default router;
