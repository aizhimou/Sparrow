insert into user (id, username, password, salt, email, role)
select 1753775883,
       'root',
       '3aaf4d8727ead6bcf61512ace7801a4b',
       'fYMtZ=DHj^$G',
       'root@sparrow.localhost',
       -1
from dual
where not exists(select 1 from user where username = 'root');