const categoryRepo = require("../repository/category");
const blogRepo = require("../repository/blog");
const tagRepo = require("../repository/tag");
const userRepo = require("../repository/user");
const commentRepo = require("../repository/comment");
const controller = {
    showDetail: async (req, res) => {
        try {
            const blog = await blogRepo.GetBlogDetail(req.params.id);
            const author = await userRepo.GetAuthorByBlogId(req.params.id);
            const comment = await commentRepo.GetCommentsByBlogId(req.params.id);
            const category = await categoryRepo.GetCategoriesByBlogId(req.params.id);
            const categories = await categoryRepo.GetTotalPerCategory();

            // add field name for search in categories
            categories.forEach(c => {
                c.name = c.name;
            });
            let tags = await tagRepo.GetTagByBlogId(req.params.id);
            if(tags && tags.length > 0) {
                tags = tags.map(item => {
                    return {
                        name: item
                    };
                });
            }
            res.render("detail", { blog, author, comment, tags, category, categories});
        } catch (error) {
            console.error('error:', error);
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = controller;