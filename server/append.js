const fs = require('fs');
const content = \

export const deleteBill = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const bill = await prisma.bill.findUnique({
    where: { id }
  });

  if (!bill) {
    return next(new ApiError(404, 'Invoice not found'));
  }

  // Hard delete from database
  await prisma.bill.delete({
    where: { id }
  });

  res.status(200).json(
    new ApiResponse(200, null, 'Invoice deleted successfully from the database')
  );
});
\;
fs.appendFileSync('./src/controllers/billing.controller.js', content);
