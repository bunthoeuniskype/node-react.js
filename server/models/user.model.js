
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('../config');


const sql = require("../database/db.js");

// constructor
const User = function(user) {
  this.email = user.email;
  this.name = user.name;
  this.password = user.password;
  this.active = user.active;
  this.isAdmin = user.isAdmin;
};

User.create = async (newuser, result) => {

    const salt = await bcrypt.genSalt(10);
    newuser.password = await bcrypt.hash(newuser.password, salt);
        
    sql.query("INSERT INTO users SET ?", newuser, (err, res) => {
        if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
        }

        console.log("created user: ", { id: res.insertId, ...newuser });
        result(null, { id: res.insertId, ...newuser });
    });
};

User.findById = (userId, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${userId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found user with the id
    result({ kind: "not_found" }, null);
  });
};

User.getAll = result => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE users SET email = ?, name = ?, active = ? WHERE id = ?",
    [user.email, user.name, user.active, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found user with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found user with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

User.removeAll = result => {
  sql.query("DELETE FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} users`);
    result(null, res);
  });
};


User.signUp = async (newuser, result) => {

    User.create(newuser, (error, data) =>{
        if (error) {
            console.log("error: ", error);
            result(error, null);
            return;
          }
        sql.query(`SELECT * FROM users WHERE id = ${data.id}`,async (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(err, null);
              return;
            }
        
            if (res.length) {
              console.log("found user: ", res[0]);
              await User.generateToken(res[0], result);
              return;
            }
        
            // not found user with the id
            result({ kind: "not_found" }, null);
          });
    });
};

User.login = (user, result) => {
    sql.query(`SELECT * FROM users WHERE active = 1 AND email = '${user.email}'`, async (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found user: ", res[0]);

        const isMatch = await bcrypt.compare(user.password, res[0].password);
        if (!isMatch){
            result({ kind: "Incorrect Password !" }, null);
            return;
        }
        await User.generateToken(res[0], result);
        return;
      }
  
      // not found user with the id
      result({ kind: "not_found" }, null);
    });
  };

User.generateToken = (data, result) =>{
   
    delete data.password;
    const payload = {
        user: {
          id: data.id,
          name: data.name
        }
      };
      jwt.sign(
        payload,
        "secret",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          result(null, {
                ...data,
                access_token: token
            }
          )
        }
      );
}
  
module.exports = User;