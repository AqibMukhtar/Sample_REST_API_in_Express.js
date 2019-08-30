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
            creationStatus: true,
            createdResource: newMember
        }
    }
    else return {
        creationStatus: false,
        createdResource: undefined
    }
}

function parseResource(originalResource) {
    let arr = JSON.parse(JSON.stringify(originalResource));
    arr.shift();
    return JSON.stringify(arr);
}

function resquestBodyProperlyConstructed(reqBody, categories, categoryIndex) {
    const incommingKeys = Object.keys(reqBody);
    let existingKeys = Object.keys(categories[categoryIndex].content[0]);
    if (JSON.stringify(incommingKeys) === JSON.stringify(existingKeys)) {
        return {
            matchingStatus: true
        }
    }
    else
        return {
            matchingStatus: false
        }
}

function updateResource(reqResource, categories, categoryIndex, contentIndex) {
    const newId = reqResource.id;
    if (idConflict(newId, categories[categoryIndex].content[contentIndex].id, categories[categoryIndex].content))
        return {
            updateStatus: false,
            message: `ID ${newId} already exists`
        }
    categories[categoryIndex].content[contentIndex] = reqResource;
    return {
        updateStatus: true,
        message: categories[categoryIndex].content[contentIndex]
    }
}

function idConflict(newId, oldId, contentArray) {
    if (newId === oldId) return false;
    for (let x of contentArray)
        if (newId === x.id) return true;
    return false;
}

module.exports = {
    checkCategory,
    checkId,
    appendResource,
    parseResource,
    appendMember,
    resquestBodyProperlyConstructed,
    updateResource
};