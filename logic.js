"use strict";

function checkCategory(category, categories) {
    let x = categories.length;
    while (x --> 0) {
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
                    status: true,
                    categoryIndex: x.index,
                    contentIndex: i,
                    memberStatus: true
                };
            }
        }
        return {
            status: false,
            categoryStatus: true,
            memberStatus: false
        };
    }
    else
        return {
            status: false,
            categoryStatus: false
        };
}

function appendResource(category, categories, keyValues) {
    let contentArray = [{}];
    contentArray[0].id = undefined;
    for (let x in keyValues) contentArray[0][(keyValues[x])] = undefined;
    let newCategory = {
        name: category,
        content: contentArray
    };
    categories.push(newCategory);
}

function appendMember(categories, category, keyValues, id) {
    const categoryIndex = checkCategory(category, categories).index;
    const incommingKeys = Object.keys(keyValues);
    let existingKeys = Object.keys(categories[categoryIndex].content[0]);
    existingKeys.shift();
    if (JSON.stringify(existingKeys) === JSON.stringify(incommingKeys)) {
        let newMember = {};
        newMember.id = id;
        for (let key in keyValues) newMember[key] = keyValues[key];
        categories[categoryIndex].content.push(newMember);
        return {
            creationStatus : true,
            createdResource: newMember
        }
    }
    else return {
        creationStatus : false,
        createdResource: undefined
    }
}

function parseResource(originalResource) {
    let arr = JSON.parse(JSON.stringify(originalResource));
    arr.shift();
    return JSON.stringify(arr);
}

module.exports = {
    checkCategory,
    checkId,
    appendResource,
    appendMember,
    parseResource
};