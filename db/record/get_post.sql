select *
from records
where post_id = $1
order by type;