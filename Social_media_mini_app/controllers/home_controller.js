const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  try {
    // Populate the user for each post
    const posts = await Post.find({})
    .sort("-createdAt")
    .populate("user")
    .populate({
      path:'comments',
      populate: {
        path: 'user'
      },
      populate: {
        path: 'likes'    //likes for the comments
      }
    }).populate('likes');  //likes for the posts

   const users = await User.find({});
   if(users) {
    return res.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users
    });
   }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};