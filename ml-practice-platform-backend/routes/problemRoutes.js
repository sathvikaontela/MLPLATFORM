const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const authMiddleware = require('../middleware/authMiddleware');
//update code


// Route to solve a problem
router.post('/solve/:id', authMiddleware, checkSolveLimit, async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ msg: 'Problem not found' });
        }

        const { userCode } = req.body;
        const solutionCode = problem.solution.replace(/\s+/g, ' ').trim();
        const normalizedUserCode = userCode.replace(/\s+/g, ' ').trim();

        if (normalizedUserCode === solutionCode) {
            // Increment solved count
            req.user.solvedCount += 1;
            // Save solved count in the database (assuming `User` is your user model)
            await User.findByIdAndUpdate(req.user.id, { solvedCount: req.user.solvedCount });
            return res.json({ msg: 'Problem solved successfully', output: problem.sampleOutput });
        } else {
            return res.status(400).json({ msg: 'Error: Your code does not match the expected solution.' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server error' });
    }
});
// Route to get all problems
router.get('/', async (req, res) => {
    try {
        const problems = await Problem.find();
        res.json(problems);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route to get a specific problem by ID
router.get('/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ msg: 'Problem not found' });
        }
        res.json(problem);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});


module.exports = router;
