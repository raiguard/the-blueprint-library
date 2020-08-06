update comments
set
  content = ${content},
  edited_timestamp = ${timestamp}
where id = ${commentID};