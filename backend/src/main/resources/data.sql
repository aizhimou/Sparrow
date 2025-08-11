insert into user (id, username, password, salt, email, role)
select -1,
       'root',
       '3aaf4d8727ead6bcf61512ace7801a4b',
       'fYMtZ=DHj^$G',
       'root@sparrow.localhost',
       'ADMIN'
from dual
where not exists(select 1 from user where username = 'root');