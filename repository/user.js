const db = require("../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const blogRepo = require('./blog');

const repo = {
    GetAuthorByBlogId : async (id) => {
        try {
            const blog = await blogRepo.GetBlogById(id);
            return db['User'].findOne({
                where: {
                    id: blog.authorId
                },
                raw: true,
            });
        }catch (error) {
            console.log('Error in GetTotalPerCategory', error);
            throw error;
        }
    }
};

module.exports = repo;
