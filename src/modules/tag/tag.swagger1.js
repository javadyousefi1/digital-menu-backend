/**
 * @swagger
 * tags:
 *  name: Tag
 *  description: Tag Module and Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          CreateTag:
 *              type: object
 *              required:
 *                  -   title
 *                  -   icon
 *              properties:
 *                  title:
 *                      type: string
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          UpdateTag:
 *              type: object
 *              required:
 *                  -   id
 *                  -   title
 *                  -   svgIcon
 *              properties:
 *                  id:
 *                      type: string
 *                  title:
 *                      type: string
 */

/**
 * @swagger
 * /api/tag/create-tag:
 *  post:
 *      summary: create new tag
 *      tags:
 *          -   Tag
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateTag'
 *      responses:
 *          201: 
 *              description: created
 */
/**
 * @swagger
 * /api/tag/update-tag:
 *  put:
 *      summary: update tag
 *      tags:
 *          -   Tag
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateTag'
 *      responses:
 *          201: 
 *              description: created
 */
/**
 * @swagger
 * /api/tag/get-all-tags:
 *  get:
 *      summary: get all tags
 *      tags:
 *          -   Tag
 *      responses:
 *          200: 
 *              description: successfully
 */
/**
 * @swagger
 * /api/tag/delete-tag:
 *  delete:
 *      summary: delete catergory
 *      tags:
 *          -   Tag
 *      parameters:
 *          -   in: query
 *              required: true
 *              name: id
 *      responses:
 *          200: 
 *              description: successfully
 */