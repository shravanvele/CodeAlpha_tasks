const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");

module.exports.create = async (req, res) => {
  try {
     let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    if (req.xhr){     //checking the if the req is of type ajax request (type of ajax are : xhr,xml,http)
      return res.status(200).json({
          data: {
              post: post
          },
          flash_message: req.flash('success', 'Post Published!'),
          message: "Post created!"
      });
  }
    return res.redirect("back");
  } catch (err) {
    req.flash('error', err);
    console.log(err);
    return res.redirect('back');
  }
};

// delete a post 

module.exports.destroy = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    if (post.user.toString() === req.user.id) {
      // CHANGE :: delete the associated likes for the post and all its comments' likes too
      await Like.deleteMany({likeable: post, onModel: 'Post'});
      await Like.deleteMany({_id: {$in: post.comments}});
      
       post.deleteOne();

      // Delete comments associated with the post
      await Comment.deleteMany({ post: req.params.id });

      if(req.xhr) {
        return res.status(200).json({
          data: {
              post_id: req.params.id
          },
          flash_message: req.flash('success', 'Post and associated comments are deleted'),
          message: "Post deleted!"
      });
      }

      req.flash('success', 'Post and associated comments are deleted');
      return res.redirect('back');
    } else {
      req.flash('error', 'You can not delete this post');
      return res.status(403).send("You're not authorized to delete this post");
    }
  } catch (err) {
    req.flash('error', err.message);
    console.error(err);
    return res.status(500).send({error: err.message});
  }
};