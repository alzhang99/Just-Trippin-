
/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; //all column names are UPPERCASE!
var credentials = require('./credentials.json');


function checkDuplicate (email, next) {
  var query = `
    SELECT *
    FROM Customer
    WHERE email = :inputEmail
  `;
  const binds = [email]
  oracledb.getConnection({
    user : credentials.user,
    password : credentials.password,
    connectString : credentials.connectString
  }, function(err, connection) {
    if (err) {
      console.log(err);
    } else {
      connection.execute(query, binds, function(err, result) {
        if (err) {console.log(err);}
        else {
          console.log(result.rows)
          if (result.rows.length > 0) {
            console.log("already exists account")
            next("Duplicate account")
          } else {
            next(null)
          }
        }
      });
    }
  });
}

function signUp(req, res) {
  let inputEmail = req.body.email
  let name = req.body.first + " " + req.body.last
  let pass = req.body.password

  checkDuplicate (inputEmail, function (isDuplicate) {
    if (isDuplicate !== null) {
      res.json([isDuplicate])
    } else {
      var query = `
        INSERT INTO 
        Customer 
        VALUES (:email, :name, :password)
      `;
      const binds = { email : {val: inputEmail }, password : {val: pass}, name: {val: name}}
      oracledb.getConnection({
        user : credentials.user,
        password : credentials.password,
        connectString : credentials.connectString
      }, function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.execute(query, binds, function(err, result) {
            if (err) {console.log(err);}
            else {
              console.log(result.rowsAffected)
              res.json(result)
            }
          }, 
          { autoCommit: true }
          );
        }
      });
    }
  })
}

function checkLogin(req, res) {
  var query = `
    SELECT *
    FROM Customer
    WHERE email = :inputEmail AND password = :inputPassword
  `;
  const binds = [req.params.email, req.params.password]
  oracledb.getConnection({
    user : credentials.user,
    password : credentials.password,
    connectString : credentials.connectString
  }, function(err, connection) {
    if (err) {
      console.log(err);
    } else {
      connection.execute(query, binds, function(err, result) {
        if (err) {console.log(err);}
        else {
          console.log(result.rows)
          if (result.rows.length == 1) {
            console.log("logged in!")
            res.cookie('user', req.body.email, { signed: true, httpOnly: true });
            return res.json(result.rows)
          } else {
            //if wrong password
            console.log("wrong pass "  + req.body.email)
            return res.json(result.rows)
          }
        }
      });
    }
  });
}


function searchCity(req, res) {
  var query = `
    SELECT *
    FROM Business
    WHERE (city=:city AND state=:st AND stars >= :stars)
  `;
  let city = req.params.city
  let state = req.params.state
  let stars = req.params.stars

  const binds = [city, state, stars]
  oracledb.getConnection({
    user : credentials.user,
    password : credentials.password,
    connectString : credentials.connectString
  }, function(err, connection) {
    if (err) {
      console.log(err);
    } else {
      connection.execute(query, binds, function(err, result) {
        if (err) {console.log(err);}
        else {
          console.log(result.rows)
          res.json(result.rows)
        }
      });
    }
  });
}



function getAllCustomers(req, res) {
  var query = `
    SELECT * 
    FROM Customer
  `;
  oracledb.getConnection({
    user : credentials.user,
    password : credentials.password,
    connectString : credentials.connectString
  }, function(err, connection) {
    if (err) {
      console.log(err);
    } else {
      connection.execute(query, function(err, result) {
        if (err) {console.log(err);}
        else {
          console.log(result.rows)
          res.json(result.rows)
        }
      });
    }
  });
}


module.exports = {
  getAllCustomers: getAllCustomers,
  checkLogin: checkLogin,
  signUp: signUp,
  searchCity: searchCity
}