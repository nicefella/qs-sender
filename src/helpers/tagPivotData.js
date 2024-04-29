/* eslint-disable arrow-parens */
/* eslint-disable quotes */
module.exports = async function tagPivotData(layout) {
     const { qHyperCube: { qPivotDataPages = [] } = {} } = layout;
     const [firstPage = {}] = qPivotDataPages;
     //  const session = await qs.init();
     //  const app = await session.openDoc(appId, "", "", "", false);
     //   const topTableObject = await app.getObject(tableTopObjectId);
     //   const layout = await topTableObject.getLayout();

     const dims = firstPage.qLeft;
     const rows = firstPage.qData;

     // const dims =
     //      data.result.qLayout[0].value.qHyperCube.qPivotDataPages[0].qLeft;
     // const rows =
     //      data.result.qLayout[0].value.qHyperCube.qPivotDataPages[0].qData;

     let refRowIndex = 0;
     dims.forEach((dim, dimIndex) => {
          if (dimIndex === 0) {
               // total row
               rows[refRowIndex] = [
                    "total",
                    "TOPLAM",
                    ...rows[refRowIndex].map((row) => row.qText),
               ];
               refRowIndex += 1;
          } else {
               // normal row
               dim.qSubNodes.forEach((subNode) => {
                    const type =
                         subNode.qText === "Totals" ? "subtotal" : "node";
                    const label =
                         subNode.qText === "Totals" ? dim.qText : subNode.qText;
                    rows[refRowIndex] = [
                         type,
                         label,
                         ...rows[refRowIndex].map((row) => row.qText),
                    ];
                    refRowIndex += 1;
               });
          }
          //  console.log(dim);
     });
     console.log(rows);
     return rows;
     // rows.forEach((row, rowIndex) => {
     //      const newRow = ["total", "TOPLAM", ...row];
     //      console.log(rowIndex);
     // });
};
