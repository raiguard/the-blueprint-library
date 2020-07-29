select *
from posts
where lower(title) like '%' || lower($1) || '%';