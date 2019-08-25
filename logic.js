"use strict";

function checkCategory(category, categories) {
    let x = categories.length;
    while (x-- > 0) {
        if (categories[x].name === category)
            return {
                status: true,
                index: x
            }
    }
    return {
        status: false
    };
}

function checkId(id, category, categories) {
    const x = checkCategory(category, categories);
    if (x.status) {
        const content = categories[x.index].content;
        let i = content.length;
        while (i --> 0) {
            if (content[i].id === id) {
                return {
                    status          : true,
                    categoryIndex   : x.index,
                    contentIndex    : i
                };
            }
        }
        return {
            status: false
        };
    }
    else
        return {
            status: false
        };
}

module.exports = { checkCategory,
checkId };