npm init -y

npm i express express-handlebars express-handlebars-paginate pg pg-hstore sequelize

sequelize init

sequelize model:create --name Category --attributes name:string
sequelize model:create --name Tag --attributes name:string
sequelize model:create --name User --attributes username:string,password:string,firstName:string,lastName:string,mobile:string,imagePath:string,isAdmin:boolean
sequelize model:create --name Blog --attributes title:string,imagePath:string,summary:text,description:text,userId:integer,categoryId:integer,authorId:integer
sequelize model:create --name Comment --attributes message:text,userId:integer,blogId:integer
sequelize model:create --name BlogTag --attributes tagId:integer,blogId:integer

sequelize seed:generate --name Category
sequelize seed:generate --name Tag
sequelize seed:generate --name User
sequelize seed:generate --name Blog
sequelize seed:generate --name Comment
sequelize seed:generate --name BlogTag

sequelize db:migrate
sequelize db:seed:all


