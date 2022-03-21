import {
  table,
  getMinifiedRecords,
  findRecordsByFilter,
} from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, neighbourhood, address, voting, imgUrl } = req.body;
    try {
      //* find a record
      if (id) {
        const records = await findRecordsByFilter(id);
        if (records.length !== 0) {
          res.json(records);
        } else {
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  voting,
                  imgUrl,
                },
              },
            ]);
            const records = getMinifiedRecords(createRecords);
            res.json(records);
          } else {
            res.status(400);
            res.json({ message: "Id or name missen" });
          }
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missen" });
      }
    } catch (error) {
      console.error("Error finding or creating store", error);
      res.status(500);
      res.json({ message: "Error finding or creating store", error });
    }
  }
};

export default createCoffeeStore;
