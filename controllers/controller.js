const pool = require("../models/db");
const cron = require("node-cron");
const sendEmail = require("../emailSender");

async function createTable() {
  try {
    const query = `
            CREATE TABLE IF NOT EXISTS MAIL_SCHEDULES (
              id SERIAL PRIMARY KEY,
              recipient VARCHAR(255) NOT NULL,
              content TEXT NOT NULL,
              date TIMESTAMP WITH TIME ZONE NOT NULL,
              repeat BOOLEAN NOT NULL
            );
          `;
    await pool.query(query);
    console.log("MAIL_SCHEDULES CREATED SUCCESSFULLY");
  } catch (error) {
    console.log("error", error);
  }
}

async function getMails(req, res) {
  try {
    const mails = await pool.query("SELECT * FROM MAIL_SCHEDULES");
    res.status(200).json(mails.rows);
  } catch (error) {
    res.status(400).json(error);
  }
}

async function postMail(req, res) {
  const { recipient, content, date, repeat } = req.body;
  try {
    await pool.query(
      "INSERT INTO MAIL_SCHEDULES (recipient,content,date,repeat) VALUES ($1, $2,$3,$4)",
      [recipient, content, date, repeat]
    );
    res.status(200).json({ message: "Mail created" });
  } catch (error) {
    res.status(400).json(error);
  }
}

async function sendMail(req, res) {
  const currentDate = new Date();

  try {
    const result = await pool.query(
      "SELECT * FROM MAIL_SCHEDULES WHERE CAST(date as DATE) = $1",
      [currentDate]
    );

    const schedules = result.rows;

    //Her bir schedule için mail gönderme işlemleri burada yapılır
    schedules.forEach((schedule) => {
      const { id, recipient, content, date, repeat } = schedule;

      const timestamp = new Date(date);
      const day = timestamp.getDay().toString();
      const month = (timestamp.getMonth() + 1).toString(); // Ay, 0'dan başladığı için +1 eklenir
      const hour = timestamp.getHours().toString();
      const minute = timestamp.getMinutes().toString();

      console.log(hour, minute);

      // Eğer repeat true ise, belirtilen günde mail gönderilir.
      if (repeat) {
        cron.schedule(
          `${minute} ${hour} * ${month} ${day}`,
          () => {
            sendEmail(recipient, content);
            pool.query(
              "UPDATE MAIL_SCHEDULES SET date = date + interval '1 week' WHERE id = $1", //her hafta tekrarlanması için
              [id]
            );

            res.status(200).json();
          },
          {
            scheduled: true,
            timezone: "Europe/Istanbul",
          }
        );
      } else {
        // Eğer repeat false ise, sadece bir kez mail gönderilir sonra db den silinir.
        cron.schedule(
          `${minute} ${hour} * ${month} ${day}`,
          () => {
            sendEmail(recipient, content);
            pool.query("DELETE FROM MAIL_SCHEDULES WHERE id = $1", [id]);

            res.status(200).json();
          },
          {
            scheduled: true,
            timezone: "Europe/Istanbul",
          }
        );
        res.status(200).json();
      }
    });
  } catch (error) {
    console.log(error);
  }
}

async function deleteAll(req, res) {
  try {
    await pool.query("DELETE FROM MAIL_SCHEDULES");
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  createTable,
  getMails,
  postMail,
  sendMail,
  deleteAll,
};
