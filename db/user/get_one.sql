select id, username, is_admin
from users
where id = $1;