import { AdminModel, CouterModel } from "../schema/admin.schema";

function getWeeksDiff(startDate: any, endDate: any) {
  const msInWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.round(Math.abs(endDate - startDate) / msInWeek);
}
export const weeklyCount = async () => {
  var counter = await CouterModel.findOne({ pos: 1 })
    .then((data) => data)
    .catch((error) => console.log(error));
  if (!counter) return;
  var thisWeek = counter?.total;
  counter.total = 0;
  await counter.save();
  await CouterModel.create({
    pos: getWeeksDiff(new Date(), new Date(2022, 6, 20)),
    lastWeek: thisWeek,
  });
};
