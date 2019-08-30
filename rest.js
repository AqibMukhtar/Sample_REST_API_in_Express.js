"use strict";
const Logic = require('./logic');
const BodyParser = require('body-parser');
const Express = require('express');
const app = Express();

// Existing resources
// categories[anyIndex].content[0] defines meta data
let students = [
    { id: undefined, name: undefined, projectNO: undefined },
    { id: 'S1', name: 'Aqib Mukhtar', projectNO: '32' },
    { id: 'S2', name: 'Abdul Rehman', projectNO: '49' },
    { id: 'S3', name: 'Muhammad Uzair', projectNO: '53' }
],
    instructors = [
        { id: undefined, name: undefined, completedProjects: undefined },
        { id: 'I1', name: 'Abdullah Sohail', completedProjects: '7' },
        { id: 'I2', name: 'Anus Baig', completedProjects: '10' }
    ];

let categories = [
    { name: 'students', content: students },
    { name: 'instructors', content: instructors }
];

// Middlewares 

app.use((req, res, next) => {
    res.set({
        'Content-Type': 'text/json'
    });
    next();
});
app.use(BodyParser.urlencoded({ 'extended': 'false' }));

// GET requests handlers to retriving resources

app.get('/api/:category', (req, res) => {
    const authentic = Logic.checkCategory(req.params.category, categories);
    if (authentic.status)
        res.status(200).send(Logic.parseResource(categories[authentic.index].content));
    else
        res.status(404).send(JSON.stringify({ message: 'Resource not found' }));
});

app.get('/api/:category/:id', (req, res) => {
    const authentic = Logic.checkId(req.params.id, req.params.category, categories);
    if (authentic.status)
        res.status(200).send(JSON.stringify(categories[authentic.categoryIndex].content[authentic.contentIndex]));
    else
        res.status(404).send(JSON.stringify({ message: 'Resource not found' }));
});

// POST request handlers to create resources

app.post('/api/:category', (req, res) => {
    const keyValues = req.body;
    const category = req.params.category;
    const authentic = Logic.checkCategory(category, categories);
    res.set({
        'Cache-Control': 'no-cache'
    });
    if (!authentic.status) {
        Logic.appendResource(category, categories, keyValues);
        res.status(201).send(JSON.stringify(categories[categories.length - 1].content));
    }
    else
        res.status(200).send(JSON.stringify({ message: 'Resource already exist' }));
});

app.post('/api/:category/:id', (req, res) => {
    const category = req.params.category, id = req.params.id, attributes = req.body;
    const authentic = Logic.checkId(id, category, categories);
    res.set({
        'Cache-Control': 'no-cache'
    });
    if (!authentic.status) {
        if (!authentic.categoryStatus) {
            res.status(200).send(JSON.stringify({ message: `${category} does not exist` }));
        }
        else if (!authentic.memberStatus) {
            const newResource = Logic.appendMember(categories, category, attributes, id)
            if (newResource.creationStatus)
                res.status(201).send(JSON.stringify(newResource.createdResource));
            else
                res.status(200).send(JSON.stringify({ message: 'Request badly constructed' }));
        }
    }
    else
        res.status(200).send(JSON.stringify({ message: 'Resource already exist' }));
});

// PUT request handlers to update resources

app.put('/api/:category/:id', (req, res) => {
    const id = req.params.id, category = req.params.category
        , authentic = Logic.checkId(id, category, categories);
    res.set({
        'Cache-Control': 'no-cache'
    });
    if (authentic.status) {
        if (Logic.resquestBodyProperlyConstructed(req.body, categories, authentic.categoryIndex).matchingStatus) {
            const updateResource = Logic.updateResource(req.body, categories, authentic.categoryIndex, authentic.contentIndex);
            if (updateResource.updateStatus)
                res.status(200).send(JSON.stringify(updateResource.message));
            else
                res.status(200).send(JSON.stringify({message : updateResource.message}));
        }
        else res.status(200).send(JSON.stringify({ message: 'Request badly constructed' }));
    }
    else
        res.status(404).send(JSON.stringify({ message: 'Resource not found' }));

});

// Port settings

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server started at port ${port}`));