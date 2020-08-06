select c.*, u.username as author_name, u.avatar as author_avatar
from comments c
inner join users u
on c.author_id = u.id
where post_id = $1
order by created_timestamp;