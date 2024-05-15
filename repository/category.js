const Sequelize = require("sequelize");
const db = require("../models");

const buildQuery = () => {
    return `
        select "Blogs".id, "Categories".name
        from "Categories" join "Blogs"
        on "Blogs"."categoryId" = "Categories".id
        where "Blogs".id = $blogId;
    `
}
const repo = {
    GetCategoriesByBlogId: async (blogId) => {
        try {
            const sequelize = db.sequelize;
            const Categories = await sequelize.query(buildQuery(), {
                bind: { blogId },
                type: Sequelize.QueryTypes.SELECT
            });
            if (Categories && Categories.length > 0) {
                return Categories;
            } else {
                return [];
            }
        } catch (error) {
            console.log('Error in GetCategoriesByBlogId', error);
            throw error
        }
    },
    GetTotalPerCategory : async () => {
        try {
            const categories = await db['Category'].findAll({
                attributes: [
                    'name',
                    [Sequelize.fn("COUNT", Sequelize.col("*")), "count"],
                ],
                group: ["name"],
                raw: true,
            });
            return categories;
        }catch (error) {
            console.log('Error in GetTotalPerCategory', error);
            throw error;
        }
    },
};

module.exports = repo;
