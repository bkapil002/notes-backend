const express = require('express');
const routes = express.Router();
const fetchuser = require('../functiones/fetchuser')
const { body, validationResult } = require('express-validator');
const Notes = require('../modules/Notes')

// route 1 ----------------------->
routes.post('/notesss', fetchuser, async (req, res) => {
        try {
            const notes = await Notes.find({ user: req.user.id });
            res.json(notes);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });


// roure 2 --------------------->

routes.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title (min length: 3)').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { tag, description, title } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Notes({
            title,
            description,
            tag,
            user: req.user.id, 
        });

        const savedNote = await note.save();

        res.json(savedNote);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


//     route 3------------------->

routes.put('/updateNote/:id', fetchuser, async (req, res) => {
        const { tag, description, title } = req.body;
        const newNots = {};
    
        if (title) { newNots.title = title };
        if (description) { newNots.description = description };
        if (tag) { newNots.tag = tag };
    
        try {
            let note = await Notes.findById(req.params.id);
    
            if (!note) {
                return res.status(404).send('Not Found');
            }
    
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send('Not Authorized');
            }
    
            note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNots }, { new: true });
    
            if (!note) {
                return res.status(404).send('Not Found');
            }
    
            res.json({ note });
    
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });

//     route3------------------->

routes.delete('/deleteDocument/:id', fetchuser, async (req, res) => {
        try {
            const { tag, title, description } = req.body;
            const newNots = {};
    
            if (title) { newNots.title = title };
            if (description) { newNots.description = description };
            if (tag) { newNots.tag = tag };
    
            const note = await Notes.findById(req.params.id);
    
            if (!note) {
                return res.status(404).send("Not found");
            }
    
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send("Not allowed");
            }
    
            await Notes.findByIdAndDelete(req.params.id);
    
            res.json({ success: "Note has been deleted" });
    
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });


module.exports = routes;