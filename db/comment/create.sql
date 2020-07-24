insert into comments (
  post_id,
  author_id,
  content,
  created_timestamp
) values (
  ${postID},
  ${authorID},
  ${content},
  ${timestamp}
);