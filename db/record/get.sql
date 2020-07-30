select *
from records
where
  (${bookID} is null and book_id is null or book_id = ${bookID})
  and post_id = ${postID}
order by index;