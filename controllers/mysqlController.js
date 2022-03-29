const mysql = require('mysql');
const xlsx = require('xlsx');
const { search } = require('./searchController');
const connection = mysql.createConnection({
  host: process.env["DB_HOST"],
  user: process.env["DB_USER"],
  password: process.env["DB_PASS"],
  database: process.env["DB_NAME"]
});

const mysqlController = {

  search: async (req, res) => {
    const searchColumn = req.body.columnName
    const searchCondition = req.body.columnCondition.split("\r\n")
    let sql = 'SELECT targetDeviceid,tokenForAlexa,tokenForGoogle FROM devices WHERE '
    let arrayData = []

    for (let i = 0; i < searchCondition.length; i++) {
      if (i === searchCondition.length - 1) {
        sql = sql + ` ${searchColumn} = "${searchCondition[i]}"`
      } else {
        sql = sql + ` ${searchColumn} = "${searchCondition[i]}" OR`
      }
    }
    console.log(sql)
    connection.query(sql, function (err, result) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return
      }

      //將查詢結果轉JSON再轉回物件消除 "RowDataPacket" {}
      for (let i = 0; i < result.length; i++) {
        let temp = JSON.stringify(result[i])
        arrayData.push(JSON.parse(temp))
      }

      //匯出成Excel
      let jsonWorkSheet = xlsx.utils.json_to_sheet(arrayData)

      // 構造workBook
      let workBook = {
        SheetNames: ['jsonWorkSheet'],
        Sheets: {
          'jsonWorkSheet': jsonWorkSheet,
        }
      };
      // 將workBook寫入檔案
      xlsx.writeFile(workBook, "../db_search_result.xlsx");
    })

    connection.end()


    return res.render('dbResult')
  }
}

module.exports = mysqlController