const Post = require("../../../models/post");
const Comment = require("../../../models/comment");

module.exports.index = async function(req , res) {
    const posts = await Post.find({})
    .sort("-createdAt")
    .populate("user", "-password") //ignoring the password 
    .populate({
      path:'comments',
      populate: {
        path: 'user'
      }
    });

return res.json(200, {
    message:"List of posts",
    post: posts
})
}

module.exports.destroy = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send({message: "Post not found"});
      }
      if (post.user.toString() === req.user.id) {
         post.deleteOne();
  
        // Delete comments associated with the post
        await Comment.deleteMany({ post: req.params.id });
        return res.json(200, {
            message: 'Post and associated comments are deleted successfully!'
        });

      } else {
        return res.status(401).send({message: "You're not authorized to delete this post"});
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send({error: err.message});
    }
  };