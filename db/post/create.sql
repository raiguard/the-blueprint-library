insert into posts (
  author_id,
  title,
  -- img,
  description,
  likes,
  created_timestamp
) values (
  ${authorID},
  ${title},
  -- ${img},
  ${description},
  0,
  ${timestamp}
)
returning id;