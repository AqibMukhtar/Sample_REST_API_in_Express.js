"use strict";
const Logic = require('./logic');
const Express = require('express');
const app = Express();

// Existing resources

let students = [
    { id: 'S1', name: 'Aqib Mukhtar', projectNo: 32 },
    { id: 'S2', name: 'Abdul Rehman', projectNO: 49 },
    { id: 'S3', name: 'Muhammad Uzair', projectNO: 53 }
],
    instructors = [
        { id: 'I1', name: 'Abdullah Sohail', completedProjects: 7 },
        { id: 'I2', name: 'Anus Baig', completedProjects: 10 }
    ];

let categories = [
    { name: 'students', content: students },
    { name: 'instructors', content: instructors }
];

// Middlewares 

app.use((req, res, next) => {
    res.set({
        'Content-Type' : 'text/json'
    });
    next();
});

// GET requests handlers to retriving resources

app.get('/api/:category', (req, res) => {
    const authentic = Logic.checkCategory(req.params.category, categories);
    if (authentic.status) {
        res.status(200).send(JSON.stringify(categories[authentic.index].content));
    }
    else {
        res.status(404).send(JSON.stringify({message : 'Resource not found'}));
    }
});

app.get('/api/:category/:id', (req, res) => {
    const authentic = Logic.checkId(req.params.id, req.params.category, categories);
    if (authentic.status) {
        res.status(200).send(JSON.stringify(categories[authentic.categoryIndex].content[authentic.contentIndex]));
    }
    else {
        res.status(404).send(JSON.stringify({message : 'Resource not found'}));
    }
});

// Port settings

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server started at port ${port}`));