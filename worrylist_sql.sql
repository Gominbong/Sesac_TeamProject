-- Active: 1733320518602@@127.0.0.1@3306@sesac


select * from worrylist left join readlist readlist on worrylist.Id = readlist.worryList_Id
where user_Id is null or user_Id != 5 order by worrylist.Id desc limit 100

select * from worrylist left join readlist readlist on worrylist.Id = readlist.worryList_Id
where user_Id is null

select * from worrylist left join readlist readlist on worrylist.Id = readlist.worryList_Id

