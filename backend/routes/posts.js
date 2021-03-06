const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const Post = require('../models/post');

// import multer for image upload feature
const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

// use multer to extract and encode incoming files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid file type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', checkAuth, multer({storage: storage}).single('image'),(req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    content2: req.body.content2,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  // save new post into db using mongo save method
  post.save().then(createdPost => {
    res.status(201).json({
    message: 'post added successfully',
    post: {
      id: createdPost._id,
      title: createdPost.title,
      content: createdPost.content,
      content2: createdPost.content2,
      imagePath: createdPost.imagePath,
    }
  });
  }).catch(error => {
    res.status(500).json({
      message: 'Creating a post failed'
    })
  });
});

router.put('/:id', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    content2: req.body.content2,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: 'post updated successfully'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized'
      }).catch(error => {
        res.status(500).json({
          message: 'Could not update post'
        })
      });
    }
  });
});

router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  console.log('THIS IS THE PAGE SIZE:', pageSize, 'THIS IS THE CURRENT PAGE:', currentPage);
  if (pageSize && currentPage){
    postQuery.skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery.then(documents => {
    fetchedPosts = documents;
      console.log(fetchedPosts);
      return Post.count();
    }).then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
    })
}).catch(error => {
  res.status(500).json({
    message: 'Retrieving posts failed'
  })
})
});

router.get('/:id', checkAuth, (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'post not found'})
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Retrieving post failed'
    })
  })
})

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id, creator: req.userData.userId
  }).then(result => {
    if (result.n > 0) {
      res.status(200).json({
        message: 'post updated successfully'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized'
      });
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Deleting posts failed'
    })
  })
});

module.exports = router;
