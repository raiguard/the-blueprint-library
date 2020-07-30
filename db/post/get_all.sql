select p.*, u.username as author_name, u.avatar as author_avatar
from posts p
inner join users u
on p.author_id = u.id
where lower(p.title) like '%' || lower($1) || '%';