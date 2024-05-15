const categoryRepo = require("../repository/category");
const blogRepo = require("../repository/blog");
const tagRepo = require("../repository/tag");

const controller = {
    showHome: async (req, res) => {
        try {
            const tags = await tagRepo.GetAllTags();
            const categories = await categoryRepo.GetTotalPerCategory();

            const page = req.query.page ? parseInt(req.query.page) : 1;
            const searchTerm = req.query.searchTerm || '';
            const category = req.query.category || '';
            const tag = req.query.tag || '';
            
            let blogs = await blogRepo.GetBlogsSummary(6, (page - 1) * 6, searchTerm, category, tag);

            if(blogs && blogs.length > 0) {
                console.log(blogs.length);
                blogs.forEach(blog => {
                    blog.updatedAt = blog.updatedAt.toISOString().split('T')[0].split('-').reverse().join('-');
                });
            }
            
            const query = req.query;
            const totalPages = 12;
            res.render("index", { categories, tags, blogs, query, totalPages});
        }catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = controller;