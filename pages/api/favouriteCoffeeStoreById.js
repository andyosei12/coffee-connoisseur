import {
  table,
  findRecordsByFilter,
  getMinifiedRecords,
} from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;
      if (id) {
        const records = await findRecordsByFilter(id);
        if (records.length !== 0) {
          const record = records[0];

          const calculateVoting = parseInt(record.voting) + 1;

          //* Update the record;
          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVoting,
              },
            },
          ]);

          if (updateRecord) {
            const minifiedRecords = getMinifiedRecords(updateRecord);
            res.json(minifiedRecords);
          }
        } else {
          res.json({ message: "Coffee store id does not exist", id });
        }
      } else {
        res.json({ message: "Id is missing" });
      }
    } catch (error) {
      res.status(500);
      res.json({ message: "Something upvoting coffee store", error });
    }
  }
};

export default favouriteCoffeeStoreById;
