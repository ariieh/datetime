exports.home = function(req, res, next) {
  res.render('index', {
    FB_APP_ID: process.env.FB_APP_ID,
    FB_PERMISSIONS: [
      "public_profile",
      "email",
      "user_friends",
      "user_actions.books",
      "user_actions.fitness",
      "user_actions.music",
      "user_actions.news",
      "user_actions.video",
      "user_birthday",
      "user_likes",
      "user_photos",
      "user_religion_politics",
      "user_tagged_places",
      "user_education_history",
      "user_groups"
    ].join(",")
  });
}
