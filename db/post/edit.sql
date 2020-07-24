update posts
set
  title = ${title},
  img = ${img},
  description = ${description},
  edited_timestamp = ${timestamp}
where id = ${id};