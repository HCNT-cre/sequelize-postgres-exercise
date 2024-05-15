const db = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const buildGetBlogDetailQuery = () => {
    return `
        with BlogTags as (select "blogId", array_agg("Tags".name) as "tags"
                          from "BlogTags"
                                   join "Tags"
                                        on "Tags".id = "BlogTags"."tagId"
                          group by "blogId"
                          order by "blogId")
        select title, "Blogs"."imagePath" as imagePath, "Blogs".description as description, "Blogs".'createdAt' as createdAt, "Users"."firstName" as authorFirstName, "Users"."lastName" as authorLastName, "Users"."imagePath" as authorImage, tags
        from "Blogs"
        join "Categories" on "Blogs"."categoryId" = "Categories".id
        join "Users" on "Users".id = "Blogs"."authorId"
        join BlogTags on BlogTags."blogId" = "Blogs".id
        where "Blogs".id = $blogId;
    `;
}


const buildGetSummaryBlog = (searchTerm, category, tag) => {
    return `
    SELECT "Blog".*
    FROM (
        SELECT
            "Blog"."title",
            "Blog"."imagePath",
            "Blog"."summary",
            "Blog"."updatedAt",
            COUNT("comments"."id") AS "commentCount",
            "Blog"."id" AS "id"
        FROM "Blogs" AS "Blog"
        LEFT OUTER JOIN "Comments" AS "comments" ON "Blog"."id" = "comments"."blogId"
        LEFT JOIN "BlogTags" AS "bt" ON "Blog"."id" = "bt"."blogId"
        LEFT JOIN "Tags" AS "t" ON "bt"."tagId" = "t"."id"
        LEFT JOIN "Categories" AS "c" ON "Blog"."categoryId" = "c"."id"
        WHERE ("Blog"."title" LIKE '%${searchTerm}%' OR "Blog"."summary" LIKE '%${searchTerm}%')
        ${category ? `AND "c"."name" = '${category}'` : ''}
        ${tag ? `AND "t"."name" = '${tag}'` : ''}
        GROUP BY "Blog"."id"
        ORDER BY "Blog"."title"
        LIMIT $limit OFFSET $offset
    ) AS "Blog";
    `
}

const repo = {
    GetBlogById: async(id) => {
        try{
            const blog = await db['Blog'].findOne({
                where: {
                    id
                },
            });
            return blog;

        }catch (error) {
            console.log('Error in GetBlogById', error);
            throw error;
        }
    },
    GetBlogsSummary : async (limit = 6, offset = 0, searchTerm = '', category=null, tag=null) => {
        try {
            const sequelize = db.sequelize;
            const blogs = sequelize.query(buildGetSummaryBlog(searchTerm, category, tag), {
                bind: {limit, offset},
                type: Sequelize.QueryTypes.SELECT
            });
            
            return blogs;
          } catch (error) {
            console.log('Error in GetTotalPerCategory', error);
            throw error;
          }
    },
    GetBlogDetail: async (id) => {
        const sequelize = db.sequelize;
        try {
            const blogDetail = await db['Blog'].findOne({
                where: {
                    id
                },
                raw: true,
            });

            return blogDetail;
        } catch (error) {
            console.log('Error in GetBlogDetail', error);
            throw error;
        }
    },
    GetBlogByTitle: async (title) => {
        try {
            return models.Blog.findAll({
                where: {
                    title: {
                        [Op.like]: `%${title}%`
                    }
                },
                attributes: [
                    'title',
                    'imagePath',
                    'summary',
                    'updatedAt',
                    [Sequelize.fn('COUNT', Sequelize.col('Comments.id')), 'totalComment']
                ],
                include: [
                    {
                        model: models.Comment,
                        required: true
                    },
                ],
                raw: true,
            });
        } catch (error) {
            console.log('Error in GetBlogByTitle', error);
            throw error;
        }
    }
};

module.exports = repo;
