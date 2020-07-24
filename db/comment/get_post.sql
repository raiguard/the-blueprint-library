select *
from comments
where post_id = $1
order by created_timestamp;