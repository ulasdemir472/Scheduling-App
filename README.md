# Scheduling-App

If you run the command below while in the directory, you can dockerize the entire project.
$docker-compose up

#Example request

"localhost:13000/" POST
{
  "recipient": "user@gmail.com",  -> gönderilecek mail adresi
  "content": "message",           -> gönderilecek mesaj
  "date": "2023-10-20 15:37:00",  -> gönderilecek tarih ve saat
  "repeat": false                 -> her hafta tekrar edilecek mi edilmeyecek mi
}

You should GET request to "localhost:13000/send" for run the service.
