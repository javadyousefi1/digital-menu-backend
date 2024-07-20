/**
 * @swagger
 * tags:
 *  name: Blog
 *  description: Blog Module and Routes
 */
/**
 * @swagger
 * tags:
 *  name: BlogComments
 *  description: BlogComments Module and Routes
 */
/**
 * @swagger
 * tags:
 *  name: BlogLikes
 *  description: BlogLikes Module and Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          CreateBlog:
 *              type: object
 *              required:
 *                  -   title
 *                  -   categoryId
 *                  -   text
 *                  -   tags
 *                  -   readingDuration
 *                  -   icon
 *              properties:
 *                  title:
 *                      type: string
 *                  readingDuration:
 *                      type: number
 *                  categoryId:
 *                      type: string
 *                  text:
 *                      type: string
 *                  tags:
 *                      type: array
 *                      items:
 *                          type: string
 *          AddComment:
 *              type: object
 *              required:
 *                  -   blogId
 *                  -   comment
 *                  -   icon
 *              properties:
 *                  blogId:
 *                      type: string
 *                  comment:
 *                      type: string
 *          LikeBlog:
 *              type: object
 *              required:
 *                  -   blogId
 *                  -   icon
 *              properties:
 *                  blogId:
 *                      type: string
 *          ReplyComment:
 *              type: object
 *              required:
 *                  -   blogId
 *                  -   commentId
 *                  -   reply
 *                  -   icon
 *              properties:
 *                  blogId:
 *                      type: string
 *                  commentId:
 *                      type: string
 *                  reply:
 *                      type: string
 *          VerifyComment:
 *              type: object
 *              required:
 *                  -   blogId
 *                  -   commentId
 *                  -   icon
 *              properties:
 *                  blogId:
 *                      type: string
 *                  commentId:
 *                      type: string
 *          DeleteComment:
 *              type: object
 *              required:
 *                  -   blogId
 *                  -   commentId
 *                  -   icon
 *              properties:
 *                  blogId:
 *                      type: string
 *                  commentId:
 *                      type: string
 */

/**
 * @swagger
 * /api/blog/create-blog:
 *  post:
 *      summary: Create a new blog post
 *      tags:
 *          - Blog
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                              description: The title of the blog post
 *                          readingDuration:
 *                              type: number
 *                              description: The estimated reading duration in minutes
 *                          categoryId:
 *                              type: string
 *                              description: The category ID associated with the blog post
 *                          text:
 *                              type: string
 *                              description: The main text content of the blog post
 *                          tags:
 *                              type: array
 *                              items:
 *                                  type: string
 *                              description: Tags associated with the blog post
 *                          file:
 *                              type: string
 *                              format: binary
 *                              description: The file image for the blog post (must be a valid image file)
 *      responses:
 *          201:
 *              description: Blog created successfully
 */

/**
 * @swagger
 * /api/blog/like-blog:
 *  post:
 *      summary: like or unlike blog
 *      tags:
 *          -   BlogLikes
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LikeBlog'
 *      responses:
 *          201: 
 *              description: likeed or unliked
 */
/**
 * @swagger
 * /api/blog/add-comment:
 *  post:
 *      summary: add comment on blog
 *      tags:
 *          -   BlogComments
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AddComment'
 *      responses:
 *          201: 
 *              description: created a comment
 */
/**
 * @swagger
 * /api/blog/reply-comment:
 *  post:
 *      summary: reply comment on blog
 *      tags:
 *          -   BlogComments
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ReplyComment'
 *      responses:
 *          201: 
 *              description: reply a comment
 */
/**
 * @swagger
 * /api/blog/verify-comment:
 *  post:
 *      summary: verify comment on blog
 *      tags:
 *          -   BlogComments
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/VerifyComment'
 *      responses:
 *          201: 
 *              description: verify a comment
 */
/**
 * @swagger
 * /api/blog/delete-comment:
 *  delete:
 *      summary: delete comment on blog
 *      tags:
 *          -   BlogComments
 *      parameters:
 *          -   in: query
 *              required: true
 *              name: blogId
 *          -   in: query
 *              required: true
 *              name: commentId
 *      responses:
 *          201: 
 *              description: delete a comment
 */
/**
 * @swagger
 * /api/blog/get-all-blogs:
 *  get:
 *      summary: get all blogs
 *      tags:
 *          -   Blog
 *      responses:
 *          200: 
 *              description: successfully
 */
/**
 * @swagger
 * /api/blog/delete-blog:
 *  delete:
 *      summary: delete blog
 *      tags:
 *          -   Blog
 *      parameters:
 *          -   in: query
 *              required: true
 *              name: id
 *      responses:
 *          200: 
 *              description: successfully
 */