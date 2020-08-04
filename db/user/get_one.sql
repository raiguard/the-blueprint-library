select id, username, avatar, is_admin
from users
where id = $1;