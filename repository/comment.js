const db = require("../models");

const repo = {
    GetCommentsByBlogId : async (id) => {
        try {
            const comments = await db['Comment'].findAll({
                where: {
                    'blogId':id
                },
                raw: true,
            });
            return comments;
        }catch (error) {
            console.log('Error in GetTotalPerCategory', error);
            throw error;
        }
    }
};

module.exports = repo;
