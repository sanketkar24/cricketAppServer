const { json } = require('express');
const db = require('../config/db');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require("dotenv").config();
class Post {
    static register(obj) {

        let ins = `INSERT INTO UserProfile(email,name,dob) values('${obj.email}','${obj.name}','${obj.dob}');`;
        return db.query(ins).then(([row]) => {
            return 1
        }).catch(error => {
            throw error;
        })
    };
    static async login(username, password) {
        let sql = `SELECT COUNT(username) as count FROM UserProfile WHERE username = '${username}';`;
        return db.query(sql).then(([row]) => {
            console.log(row[0].count)
            if (row[0].count == 0) {
                //  WRONG USERNAME AND PASSWORD
                console.log("INVALID CREDENTIALS")
            }
            else {
                // LOGIN
                let ins = `SELECT * FROM UserProfile WHERE username = '${username}';`;
                return db.query(ins).then(async ([row]) => {
                    try {
                        if (await bcrypt.compare(password, row[0].password)) {
                            console.log(row[0])
                            var jsonToken = jwt.sign({ result: { username: row[0].username, password: password } }, process.env.ACCESS_KEY)
                            return jsonToken
                        }
                    } catch (error) {
                        console.log("WRONG PASSWORD")
                        return "wrong password"
                    }
                }).catch(error => {
                    throw error;
                })
            }
        }).catch(error => {
            throw error;
        })
    }
    static reset(username, password, newpassword) {
        let sql = `SELECT COUNT(username) as count FROM UserProfile WHERE username = '${username}';`;
        return db.query(sql).then(async ([row]) => {
            console.log(row[0].count)
            if (row[0].count == 0) {
                //  WRONG USERNAME AND PASSWORD
                console.log("username doesn't exist")
            }
            else {
                let check = `SELECT * FROM UserProfile WHERE username = '${username}';`;
                return db.query(check).then(async ([row]) => {
                    try {
                        if (await bcrypt.compare(password, row[0].password)) {
                            const hashedPassword = await bcrypt.hash(newpassword, 10)
                            console.log(hashedPassword)
                            let upd = `UPDATE UserProfile 
                            SET password = '${hashedPassword}'
                            WHERE username = '${username}';`;
                            return db.query(upd).then(([row]) => {
                                return "SUCCESSFUL";
                            }).catch(error => {
                                throw error;
                            })
                        }
                        else {
                            return "WRONG PASSWORD"
                        }
                    } catch (error) {
                        throw error;
                    }
                }).catch(error => {
                    throw error;
                })
            }
        }).catch(error => {
            throw error;
        })
    }
    static getUser(obj) {
        let sql = `SELECT * FROM UserProfile where email='${obj.email}';`;
        return db.execute(sql);
    }
    static getUpcoming() {
        let sql = `SELECT t1.*, t2.team_name as t1_name, t3.team_name as t2_name,t2.players as t1_players, 
        t3.players as t2_players FROM upcoming_matches t1, Team t2, Team t3 
        where team1_id = t2.team_id and team2_id = t3.team_id`;
        return db.execute(sql);
    }
    static getCompleted() {
        let sql = `SELECT match_id,date,location,t2.team_name as t1_name, t3.team_name as t2_name,score_1, score_2, 
        t5.team_name as toss_winner,
        t4.team_name as winner_name,
        description,
        team1_prob, team2_prob
        FROM completed_matches t1, Team t2, Team t3, Team t4, Team t5
        where team1_id = t2.team_id
        and team2_id = t3.team_id
        and winner = t4.team_id
        and toss_won = t5.team_id;`;
        return db.execute(sql);
    }
    static invest(obj) {
        let coins = obj.coins;
        let email = obj.email;
        let match_id = obj.match_id;
        let winning_team = obj.winning_team;
        let sql = `UPDATE UserProfile SET coins = coins - ${coins} WHERE email = '${email}';`;
        let sql2 = `INSERT INTO invest(MATCH_ID, EMAIL, WINNING_TEAM, COINS) VALUES(${match_id}, '${email}', ${winning_team}, ${coins});`;
        try {
            db.execute(sql2);
        } catch (error) {
            console.log(error)
            return false;
        }
        try {
            db.execute(sql);
        } catch (error) {
            console.log(error)
            return false;
        }
        return true;
    }
    static userLog(obj) {
        let email = obj.email;
        let sql = `select t1.*, t2.date, t2.location, t3.team_name, t4.team_name, winner
        from invest t1, completed_matches t2, Team t3, Team t4
        where t1.match_id = t2.match_id
        and t3.team_id = team1_id
        and t4.team_id = team2_id
        and t1.email = '${email}';`;
        return db.execute(sql);
    }
    static async result(obj) {
        let match_id = obj.match_id;
        let winning_team = obj.winning_team;
        let description = obj.description;

        let insertResult = `INSERT INTO matchresult(match_id, match_winner) VALUES(${match_id}, ${winning_team});`
        db.execute(insertResult).then(([row]) => {
            // console.log(row)
        }).catch(error => {
            console.log(error)
            return false;
        })
        let match_data;
        let getMatchInfo = `select * from upcoming_matches where match_id = ${match_id};`
        await db.execute(getMatchInfo).then(([row]) => {
            console.log({'row':row})
            match_data = row[0];
            console.log({'match_data':match_data})

            let insertQuery = `INSERT INTO completed_matches(match_id, date, location, team1_id, team2_id, winner, description) VALUES(${match_id}, '${match_data.date}', '${match_data.location}', ${match_data.team1_id}, ${match_data.team2_id}, ${winning_team}, '${description}')`;
                
            console.log(insertQuery)
            db.execute(insertQuery).then(([row]) => {
                // console.log(row)
            }).catch(error => {
                console.log(error)
                return false;
            })
        }).catch(error => {
            console.log(error)
            return false;
        })
        // console.log('match_data')

        let deleteQuery = `DELETE FROM upcoming_matches where match_id = ${match_id};`
        db.execute(deleteQuery).then(([row]) => {
            // console.log(row)
        }).catch(error => {
            console.log(error)
            return false;
        })
        let investDetails = `select * from invest where match_id = ${match_id}`
        db.execute(investDetails).then(([row]) => {
            // console.log(row)
            for (let i = 0; i < row.length; i++) {
                let email = row[i].email;
                let winning_team_invest = row[i].winning_team;
                let coinsInvested = row[i].coins;
                if (winning_team == winning_team_invest) {
                    coinsInvested *= 2
                }
                else {
                    coinsInvested /= 0;
                }
                let updateCoins = `Update UserProfile set coins = coins + ${coinsInvested} where email = '${email}';`
                db.execute(updateCoins).
                    then(([row]) => {
                        console.log(row)
                    }).catch(error => {
                        console.log(error)
                        return false;
                    })
            }
        }).catch(error => {
            console.log(error)
            return false;
        })

        return true;
    }

    // let sql = 'DELETE * FROM upcoming_matches where match_id = ${match_id};'

    // try {
    //     db.execute(sql2);  
    // } catch (error) {
    //     console.log(error)
    //     return false;
    // } 
    // try {
    //      db.execute(sql);
    // } catch (error) {
    //     console.log(error)
    //     return false;
    // }
    // return true;
    // static findByName(name){
    //     let sql = `SELECT * FROM MovieDB
    //          where LOWER(original_title) LIKE LOWER('%${name}%');`;
    //     return db.execute(sql);
    // }
    // static getRev(id){
    //     let sql = `SELECT * from REVIEW WHERE movie_id ='${id}';`;
    //     return db.execute(sql);
    // }
    // static insertTo(obj){
    //     console.log(obj)
    //     let sql = `INSERT INTO MOVIEDB(adult,backdrop_path, id, original_language, original_title, overview, poster_path, release_date, title, video)
    //     values(${obj.adult}, '${obj.backdrop_path}', ${obj.id}, '${obj.original_language}', '${obj.original_title}', '${obj.overview}', '${obj.poster_path}', '${obj.release_date}', '${obj.title}', ${obj.video});`;
    //     return db.execute(sql);
    // }
    // static getPopMovie(){
    //     let sql = `SELECT * FROM MovieDB;`;
    //     return db.execute(sql);
    // }
    // static getMovieByID(movie_id){
    //     let sql = `select * from MovieDB WHERE id = '${movie_id}';`;
    //     return db.execute(sql);
    // }
    // static getMovieByGenre(genre){
    //     let sql = `select * from MovieDB, category where genre='${genre}' and movie_id=id;`;
    //     return db.execute(sql);
    // }
    // static getUserInfo(username){
    //     let sql = `select * from UserProfile where username='${username}';`;
    //     return db.execute(sql);
    // }
    // static postReview(username, review, score, movie_id){
    //     if(score=='')    score=0;
    //     let sql = `insert into Review(username, review, submitdate, movie_id, score) values('${username}','${review}',curdate(),${movie_id},${score});`;

    //     return db.execute(sql);
    // }
    // static getCount(movie_id){
    //     let sql = `select getReviews(${movie_id}) as output`;
    //     return db.execute(sql);
    // }
    // static getCastMovie(movie_id){
    //     let sql = `select * from cast where movie_id = '${movie_id}'`;
    //     return db.execute(sql);
    // }
}

module.exports = Post;