/**
 * @swagger
 * tags:
 *  name: Menu
 *  description: Menu Module and Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          ToggleStatusMenu:
 *              type: object
 *              required:
 *                  -   menuId
 *                  -   icon
 *              properties:
 *                  menuId:
 *                      type: string
 */


/**
 * @swagger
 * /api/menu/create-menu:
 *  post:
 *      summary: Create a new menu post
 *      tags:
 *          - Menu
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          title:
 *                              type: string
 *                              description: The title of the menu post
 *                          text:
 *                              type: string
 *                              description: The main text content of the menu post
 *                          price:
 *                              type: number
 *                              description: the price of the menu post
 *                          offPrice:
 *                              type: number
 *                              description: the off price of the menu post
 *                          isActive:
 *                              type: boolean
 *                              description: status of the menu post
 *                          categoryId:
 *                              type: string
 *                              description: The category ID associated with the menu post
 *                          file:
 *                              type: string
 *                              format: binary
 *                              description: The file image for the menu post (must be a valid image file)
 *      responses:
 *          201:
 *              description: Menu created successfully
 */


/**
 * @swagger
 * /api/menu/update-menu:
 *  put:
 *      summary: update a new menu post
 *      tags:
 *          - Menu
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: string
 *                              description: the updated item ID
 *                          title:
 *                              type: string
 *                              description: The title of the menu post
 *                          text:
 *                              type: string
 *                              description: The main text content of the menu post
 *                          price:
 *                              type: number
 *                              description: the price of the menu post
 *                          offPrice:
 *                              type: number
 *                              description: the off price of the menu post
 *                          isActive:
 *                              type: boolean
 *                              description: status of the menu post
 *                          categoryId:
 *                              type: string
 *                              description: The category ID associated with the menu post
 *                          file:
 *                              type: string
 *                              format: binary
 *                              description: The file image for the menu post (must be a valid image file)
 *      responses:
 *          201:
 *              description: Menu created successfully
 */

/**
 * @swagger
 * /api/menu/get-all-menus:
 *  get:
 *      summary: get all menus
 *      tags:
 *          -   Menu
 *      parameters:
 *          -   in: query
 *              required: false
 *              name: pageSize
 *          -   in: query
 *              required: false
 *              name: pageIndex
 *      responses:
 *          200: 
 *              description: successfully
 */

/**
 * @swagger
 * /api/menu/get-menu-byId:
 *  get:
 *      summary: get menu by id
 *      tags:
 *          -   Menu
 *      parameters:
 *          -   in: query
 *              required: false
 *              name: id
 *      responses:
 *          200: 
 *              description: successfully
 */


/**
 * @swagger
 * /api/menu/delete-menu:
 *  delete:
 *      summary: delete menu
 *      tags:
 *          -   Menu
 *      parameters:
 *          -   in: query
 *              required: true
 *              name: id
 *      responses:
 *          200: 
 *              description: successfully
 */


/**
 * @swagger
 * /api/menu/toggle-menu-status:
 *  patch:
 *      summary: toggle menu status
 *      tags:
 *          -   Menu
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/ToggleStatusMenu'
 *      responses:
 *          201: 
 *              description: created
 */